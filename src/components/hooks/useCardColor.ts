import { ThemeContext } from "styled-components";
import { CardState } from "../../state/CardState";
import { themeColor } from "./useThemeColor";
import React from "react";

export function useCardColor(cardState: CardState) {
  const theme = React.useContext(ThemeContext);
  if (cardState.themeColor) {
    if (cardState.themeColor === "custom" && cardState.customColor) {
      return cardState.customColor;
    }
    if (cardState.themeColor !== "custom") {
      return themeColor(theme, cardState.themeColor);
    }
  }

  return themeColor(theme, "brand");
}
