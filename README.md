# figma-export-colors

<a href="https://www.npmjs.com/package/figma-export-colors"><img src="https://badgen.net/npm/v/figma-export-colors" alt="Version"></a>
<a href="https://www.npmjs.com/package/figma-export-colors"><img src="https://badgen.net/npm/dm/figma-export-colors" alt="Downloads"></a>

Command line script to generate a `.js` or `.ts` colors object from the generated colors using [tailwind-css-color-generator](https://www.figma.com/community/plugin/1242548152689430610/tailwind-css-color-generator) that you can spread in your `tailwind.config` file.

## Description

example config file:

```json
{
  "figmaPersonalToken": "YOUR_PERSONAL_TOKEN",
  "fileId": "FILE_ID",
  "page": "Color",
  "frame": "Colors",
  "exportPath": "constants/colors",
  "typescript": true
}
```

## Features

- Wizard to generate config, you will be prompted for any missing key
- WIP

## Installation

Install the cli globally so you can use it on any directory

```sh
npm install -g figma-export-colors
```

Or if you prefer install it in your project

```sh
npm install -D figma-export-colors
```

## Usage

If you have installed the module globally:

```sh
$ export-colors
```

If you have installed it locally:

Create a script in your package.json

```js
scripts: {
 'export-colors': 'export-colors'
}
```

and run

```sh
npm run export-colors
```

OR

run it directly with:

```sh
npx export-colors
```

## Example of an exported file as colors.js/ts

```js
export const colors = {
  black: "#000000",
  white: "#ffffff",
  yellow: {
    50: "#fdffe7",
    100: "#f9ffc1",
    200: "#f8ff86",
    ...
  },
  purple: {
    50: "#f3f3ff",
    100: "#eae9fe",
    200: "#d8d6fe",
    ...
  },
  ...
};
```

## In your tailwind.config you spread the exported colors object

```js
import { colors } from "./constants/colors";

const config = {
  theme: {
    colors: {
      current: "currentColor",
      transparent: "transparent",
      ...colors,
    },
  },
};
```

## Credits

This script was inspired by https://github.com/tsimenis/figma-export-icons and to use with the figma plugin https://www.figma.com/community/plugin/1242548152689430610/tailwind-css-color-generator
