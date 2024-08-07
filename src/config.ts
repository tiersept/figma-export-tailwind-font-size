import * as convict from "convict";

export const config = convict({
  figmaPersonalToken: {
    doc: "The Figma API personal access token",
    format: String,
    default: null,
    nullable: false,
    arg: "figmaPersonalToken",
  },
  fileId: {
    doc: "The fileId of the Figma page to export from",
    format: String,
    default: null,
    nullable: false,
    arg: "fileId",
  },
  fontSizePage: {
    doc: "The name of the Figma page to export from",
    format: String,
    default: null,
    nullable: false,
    arg: "fontSizePage",
  },
  fontSizeFrames: {
    doc: "The frame name(s) in Figma page.",
    format: Array,
    default: null,
    nullable: true,
    arg: "fontSizeFrames",
  },
  fontSizeExportDirectory: {
    doc: "The path where the exported font sizes should be saved",
    format: String,
    default: "./constants",
    arg: "fontSizeExportDirectory",
  },
  fontSizeExportFileName: {
    doc: "The file name where the exported font sizes should be saved",
    format: String,
    default: "fontSize",
    arg: "fontSizeExportFileName",
  },
  typescript: {
    doc: "Whether to output TypeScript files",
    format: Boolean,
    default: true,
    arg: "typescript",
  },
});
