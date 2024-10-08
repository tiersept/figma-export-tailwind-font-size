#!/usr/bin/env node

import { program } from 'commander';
import { createBuilder } from './utils';
import { CommandOptions } from './types/commandOptions';
import { loadConfig } from './scripts/loadConfig';
import { checkFigmaToken } from './scripts/checkFigmaToken';
import { checkFigmaFileId } from './scripts/checkFigmaFileId';
import { getFontSizeFrames } from './scripts/getFontSizeFrames';
import { checkFigmaPage } from './scripts/checkFigmaPage';
import { createFontSizeFile } from './scripts/createFontSizeFile';

program
  .version('1.0.0')
  .option(
    '-c, --config <path>',
    'Path to configuration file',
    'figma-export-config.json'
  )
  .option('--figmaPersonalToken <token>', 'Figma API personal access token')
  .option('--fontSizePage <pageName>', 'Name of the Figma page to export')
  .option('--fontSizeFrame <frameName>', 'Name of the frame in Figma')
  .option(
    '--fontSizeExportDirectory <path>',
    'Path where to save exported font sizes'
  )
  .option('--typescript', 'Output TypeScript files')
  .action((options: CommandOptions) => {
    createBuilder({
      'Read configuration file...': loadConfig,
      'Checking token...': checkFigmaToken,
      'Checking file id...': checkFigmaFileId,
      'Checking page...': checkFigmaPage,
      'Fetching font sizes...': getFontSizeFrames,
      'Creating font size file...': createFontSizeFile,
    })({
      commandOptions: options,
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  });

program.parse(process.argv);
