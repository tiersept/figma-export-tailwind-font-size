const defaults = require("./defaults");

const prompts = [
  {
    type: "text",
    name: "figmaPersonalToken",
    message: "Your figma token:",
    validate: (value) =>
      value === ""
        ? "Generate a personal token for figma, read here:\nhttps://www.figma.com/developers/docs#authentication"
        : true,
  },
  {
    type: "text",
    name: "fileId",
    message: "What is the figma file ID?",
    validate: (value) =>
      value === ""
        ? "Visit figma project in the browser and copy the id:\nhttps://www.figma.com/file/FILE-ID/project-name"
        : true,
  },
  {
    type: "text",
    name: "fontSizePage",
    message: "Name of the page with typography?",
    initial: defaults.fontSizePage,
  },
  {
    type: "list",
    name: "fontSizeFrames",
    message:
      "Name of the frames with typography? If more than 1, use a comma to seperate.",
    initial: defaults.fontSizeFrames,
    separator: ",",
  },
  {
    type: "text",
    name: "fontSizeExportDirectory",
    message: "Directory to generate typography file to",
    initial: defaults.fontSizeExportDirectory,
  },
  {
    type: "text",
    name: "fontSizeExportFileName",
    message: "File name to generate font size object to",
    initial: defaults.fontSizeExportFileName,
  },
  {
    type: "confirm",
    name: "typescript",
    message: "Export a typescript file?",
    initial: defaults.typescript,
  },
];

module.exports = prompts;
