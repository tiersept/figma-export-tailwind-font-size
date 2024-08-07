export type FontStyle = string;

export interface FontStyles {
  lineHeight: FontStyle;
  letterSpacing: FontStyle;
  fontWeight: FontStyle;
}

export interface FontSizeResult {
  [fontSizeName: string]: {
    [fontSize: FontStyle]: FontStyles;
  };
}
