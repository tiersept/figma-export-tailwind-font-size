# figma-export-tailwind-font-size

<a href="https://www.npmjs.com/package/figma-export-tailwind-font-size"><img src="https://badgen.net/npm/v/figma-export-tailwind-font-size" alt="Version"></a>
<a href="https://www.npmjs.com/package/figma-export-tailwind-font-size"><img src="https://badgen.net/npm/dm/figma-export-tailwind-font-size" alt="Downloads"></a>

Command line script to export text styles from Figma as an object that is generated from the plugin [tailwind-css-font-size-generator](https://www.figma.com/community/plugin/1396073275592897278/tailwind-css-font-size-generator) that you can spread in your `tailwind.config` file.

## Features

- No more manually writing the text styles in your codebase!
- Use in combination with the [tailwind-css-font-size-generator](https://www.figma.com/community/plugin/1396073275592897278/tailwind-css-font-size-generator) Figma plugin to make life easy.
- Export font size styles from figma into your codebase with a single command.

## Installation

Install the cli globally so you can use it in any directory

```sh
npm install -g figma-export-tailwind-font-size
```

Or install it in your project

```sh
npm install -D figma-export-tailwind-font-size
```

## Usage

Create a `figma-export-config.json` file in the root directory with the following structure

```json5
{
  figmaPersonalToken: "YOUR_PERSONAL_TOKEN",
  // File id can be found in the url of the figma file
  // E.g https://www.figma.com/design/[FILE_ID]/
  fileId: "FILE_ID",
  // The page name
  fontSizePage: "Typography",
  // Array of the frame names on the page where the font sizes are grouped by
  fontSizeFrames: ["primary", "secondary-bold", "secondary-regular"],
  fontSizeExportDirectory: "constants",
  fontSizeExportFileName: "fontSize",
  typescript: true,
}
```

If you have installed the module globally:

```sh
$ export-font-size
```

If you have installed it locally:

Create a script in your package.json

```js
scripts: {
 'export-font-size': 'export-font-size'
}
```

and run

```sh
npm run export-font-size
```

OR

run it directly with:

```sh
npx export-font-size
```

## Example of an exported file as fontSize.js

```js
module.exports.fontSize = {
  "sm-primary": [
    "0.875rem",
    {
      lineHeight: "112%",
      letterSpacing: "0rem",
      fontWeight: "400",
    },
  ],
  "base-primary": [
    "1rem",
    {
      lineHeight: "112%",
      letterSpacing: "0rem",
      fontWeight: "400",
    },
  ],
  "lg-primary": [
    "1.125rem",
    {
      lineHeight: "112%",
      letterSpacing: "0rem",
      fontWeight: "400",
    },
  ],
  // etc...
};
```

## Example of an exported file as fontSize.ts

```ts
export const fontSize = {
  "sm-primary": [
    "0.875rem",
    {
      lineHeight: "112%",
      letterSpacing: "0rem",
      fontWeight: "400",
    },
  ],
  "base-primary": [
    "1rem",
    {
      lineHeight: "112%",
      letterSpacing: "0rem",
      fontWeight: "400",
    },
  ],
  "lg-primary": [
    "1.125rem",
    {
      lineHeight: "112%",
      letterSpacing: "0rem",
      fontWeight: "400",
    },
  ],
  // etc...
};
```

## In your tailwind.config you spread the exported fontSize object

```ts
import type { Config } from "tailwindcss";
import { fontSize } from "./constants/fontSize";

const tFontSize = fontSize as Config["theme"];

const config: Config = {
  theme: {
    fontSize: {
      ...tFontSize,
    },
  },
};
```

---
*This package was developed as a tool to improve the DX at [Bravoure](https://bravoure.nl/en)*
