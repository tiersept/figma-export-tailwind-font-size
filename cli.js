#!/usr/bin/env node

const defaults = require("./src/defaults");
const figma = require("./src/figma-client");
const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");
const ui = require("cliui")({ width: 80 });
const prompts = require("prompts");
const promptsList = require("./src/prompts");
const mkdirp = require("mkdirp");
const pxToRem = require("./src/utils/pxToRem.js");
const argv = require("minimist")(process.argv.slice(2));

let config = {};
let figmaClient;

const spinner = ora();

function deleteConfig() {
  const configFile = path.resolve(defaults.configFileName);
  if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile);
    console.log(chalk.cyan.bold("Deleted previous config"));
  }
}

function updateGitIgnore() {
  const ignorePath = ".gitignore";
  const configPath = argv.config || defaults.configFileName;
  const ignoreCompletePath = path.resolve(ignorePath);

  if (fs.existsSync(configPath)) {
    const ignoreContent = `\n#figma-export-config\n${configPath}`;
    const ignore = fs.existsSync(ignoreCompletePath)
      ? fs.readFileSync(ignoreCompletePath, "utf-8")
      : "";
    if (!ignore.includes(ignoreContent)) {
      fs.writeFileSync(ignoreCompletePath, ignore + ignoreContent);
      console.log(`Updated ${ignorePath} : ${ignoreContent}`);
    }
  }
}

function getConfig() {
  return new Promise((resolve) => {
    const configFile = path.resolve(argv.config || defaults.configFileName);

    if (fs.existsSync(configFile)) {
      config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
      const missingConfig = promptsList.filter(
        (q) => config?.[q.name] === undefined || config?.[q.name] === ""
      );

      if (missingConfig.length > 0) {
        getPromptData(missingConfig).then(() => resolve());

        return;
      }

      resolve();
    } else {
      getPromptData().then(() => resolve());
    }
  });
}

async function getPromptData(list = promptsList) {
  const onCancel = (prompt) => {
    process.exit(1);
  };

  const response = await prompts(list, { onCancel });

  config = Object.assign(config, response);

  fs.writeFileSync(defaults.configFileName, JSON.stringify(config, null, 2));
}

function createOutputDirectory() {
  return new Promise((resolve) => {
    const directory = path.resolve(config.fontSizeExportDirectory);
    if (!fs.existsSync(directory)) {
      console.log(`Directory ${config.fontSizeExportDirectory} does not exist`);
      if (mkdirp.sync(directory)) {
        console.log(`Created directory ${config.fontSizeExportDirectory}`);
        resolve();
      }
    } else {
      resolve();
    }
  });
}

function createOutputFile(typographyObject) {
  return new Promise((resolve) => {
    const directory = path.resolve(config.fontSizeExportDirectory);
    const filePath = path.join(
      directory,
      `${config.fontSizeExportFileName}.${config.typescript ? "ts" : "js"}`
    );

    if (!fs.existsSync(filePath)) {
      console.info(
        chalk.cyan.bold("No previous file to found. Creating new file.")
      );
    } else {
      console.info(
        chalk.cyan.bold("Previous file to found. Overwriting file.")
      );
    }

    const content = `export const fontSize = ${JSON.stringify(
      typographyObject,
      null,
      2
    )};\n`;

    fs.writeFile(filePath, content, (err) => {
      if (err) throw err;
    });

    resolve();
  });
}

function getFigmaFile() {
  return new Promise((resolve) => {
    spinner.start(
      "Fetching Figma file (this might take a while depending on the figma file size)"
    );
    figmaClient
      .get(`/files/${config.fileId}`)
      .then((res) => {
        const endTime = new Date().getTime();
        spinner.succeed();
        console.log(
          chalk.cyan.bold(
            `Finished in ${(endTime - res.config.startTime) / 1000}s\n`
          )
        );

        const page = res.data.document.children.find(
          (c) => c.name === config.fontSizePage
        );

        if (!page) {
          console.log(
            chalk.red.bold("Cannot find typography page, check your settings")
          );
          return;
        }

        let pageChildren = page.children;

        resolve(pageChildren);
      })
      .catch((err) => {
        spinner.fail();
        if (err.response) {
          console.log(
            chalk.red.bold(
              `Cannot get Figma file: ${err.response.data.status} ${err.response.data.err}`
            )
          );
        } else {
          console.log(err);
        }
        process.exit(1);
      });
  });
}

function makeRow(key, value) {
  return `${chalk.cyan.bold(key)}\t    ${chalk.green(value)}\t`;
}

function makeResultsTable(colorsObject) {
  const entries = Object.entries(colorsObject)
    .map(([key, config]) => makeRow(key, config?.[0]))
    .join(`\n`);

  ui.div(makeRow(`\n\n` + "Size - Name", "Value") + `\n\n` + entries);

  console.log(ui.toString());
}

function exportFontSize() {
  getFigmaFile().then((res) => {
    const frames = res.filter((frame) =>
      config.fontSizeFrames.includes(frame.name)
    );

    const typographyObject = frames.reduce((finalObject, group) => {
      const groupKey = group.name.toLowerCase();

      const groupValues = group.children.reduce((groupObj, child) => {
        const name = child.name;
        const styles = child.style;

        groupObj[`${name}-${groupKey}`] = [
          pxToRem(child.style.fontSize),
          {
            lineHeight: `${styles.lineHeightPercentFontSize}%`,
            letterSpacing: `${styles.letterSpacing}px`,
            fontWeight: styles.fontWeight,
          },
        ];
        return groupObj;
      }, {});

      return { ...finalObject, ...groupValues };
    }, {});

    createOutputDirectory().then(() => {
      spinner.start("Creating font size file\n");
      createOutputFile(typographyObject).then(() => {
        makeResultsTable(typographyObject);
        spinner.succeed(chalk.cyan.bold("Export font sizes done!\n"));
      });
    });
  });
}

function run() {
  updateGitIgnore();
  if (argv.c) {
    deleteConfig();
  }
  getConfig().then(() => {
    figmaClient = figma(config.figmaPersonalToken);
    exportFontSize();
  });
}

run();
