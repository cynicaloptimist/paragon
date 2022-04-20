import { ThemeContext, ThemeType } from "grommet";
import { normalizeColor } from "grommet/utils";
import * as React from "react";

export function useThemeColor(colorName: string) {
  const theme: ThemeType = React.useContext(ThemeContext);
  return themeColor(theme, colorName);
}

export function themeColor(theme: ThemeType, colorName: string) {
  const colorFromTheme = theme.global?.colors?.[colorName] ?? colorName;
  return normalizeColor(colorFromTheme, theme);
}
