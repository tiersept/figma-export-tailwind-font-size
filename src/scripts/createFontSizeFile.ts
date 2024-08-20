import { RunnerFn } from '../types/runnerFn';
import { config } from '../config';
import { BuilderConfig } from '../types/builderConfig';
import * as ora from 'ora';
import * as path from 'node:path';
import * as fs from 'fs';

export const createFontSizeFile: RunnerFn = async (
  spinner: ora.Ora,
  configuration: BuilderConfig
) =>
  new Promise<BuilderConfig>(async (resolve, reject) => {
    const directory = path.resolve(
      config.get('fontSizeExportDirectory') as string
    );
    const filename = path.parse(config.get('fontSizeExportFileName') as string);
    const extension = config.get('typescript') ? 'ts' : 'js';

    if (
      !fs.existsSync(directory) &&
      !fs.mkdirSync(directory, { recursive: true })
    ) {
      return reject(`Could not create font size directory (${directory})`);
    }

    const fullPath = path.resolve(directory, `${filename.base}.${extension}`);
    const template = {
      ts: 'export const fontSize = #FONTSIZE;\n',
      js: 'module.exports.fontSize = #FONTSIZE;\n',
    };

    const content = template[extension].replace(
      '#FONTSIZE',
      JSON.stringify(configuration.fontSizes, null, 2)
    );

    fs.writeFile(fullPath, content, (err) => {
      if (!err) {
        spinner.succeed(`🚀 Created font size file (${fullPath})`);
        resolve(configuration);
      } else {
        reject(err);
      }
    });
  });
