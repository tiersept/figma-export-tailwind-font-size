import { RunnerFn } from '../types/runnerFn';
import { config } from '../config';
import { getNodeByPath } from '../utils';
import { BuilderConfig } from '../types/builderConfig';
import * as _ from 'lodash';
import { Node, TEXT } from 'figma-api/lib/ast-types';
import * as ora from 'ora';
import { isParentalNode } from '../types/parentalNode';
import { FontSizeResult } from '../types/fontSizeResult';

const pxToRem = (px: string | number, base: number = 16): string => {
  let tempPx: string | number = px;

  if (typeof px === 'string') {
    tempPx = px.replace('px', '');
  }

  tempPx = parseInt(tempPx as string, 10);

  return (1 / base) * tempPx + 'rem';
};

export const getFontSizeFrames: RunnerFn = async (spinner, configuration) =>
  new Promise<BuilderConfig>(async (resolve, reject) => {
    const fontSizeFrames = config.get('fontSizeFrames');

    if (fontSizeFrames && fontSizeFrames.length < 1) {
      reject(`Could not find frames`);

      return;
    }

    const paletteNodes: Node[] = fontSizeFrames.map(
      (frame: string, index: number) => {
        const node = getNodeByPath(configuration.page, [frame]);

        if (!node) {
          reject(
            `Could not find frame "${frame}" in page "${config.get('fontSizePage')}"`
          );

          return;
        }

        return node;
      }
    );

    spinner.succeed('Font sizes found');

    configuration.fontSizes = paletteNodes.reduce((finalObject, group) => {
      if (!isParentalNode(group)) return finalObject;

      const groupKey = group.name.toLowerCase();

      const groupValues = group.children.reduce((groupObj, child) => {
        const textNode = child as Node & TEXT;
        const name = textNode.name;

        const styles = textNode.style;

        const groupName = `${name}-${groupKey}`;

        ora({ indent: (spinner.indent || 1) * 4 })
          .start()
          .succeed(groupName);

        if (styles) {
          groupObj[groupName] = [
            pxToRem(styles.fontSize),
            {
              lineHeight: `${styles.lineHeightPercentFontSize}%`,
              letterSpacing: pxToRem(styles.letterSpacing),
              fontWeight: `${styles.fontWeight}`,
            },
          ];
        }
        return groupObj;
      }, {});

      return { ...finalObject, ...groupValues };
    }, {} as FontSizeResult);

    resolve(configuration);
  });
