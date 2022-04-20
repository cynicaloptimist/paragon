import { BoxProps } from "grommet";
import { CardState, PlayerViewPermission } from "../../../state/CardState";

export function ComputeThemeProps(cardState: CardState): BoxProps {
  const props = {
    border: { color: cardState.themeColor ?? "brand", size: "medium" },
    background: cardState.themeColor ?? "brand",
  };

  if (cardState.themeColor === "custom") {
    if (!cardState.customColor) {
      console.warn("cardState.themeColor is custom but no customColor is set.");
    }
    props.border.color = cardState.customColor ?? "brand";
    props.background = cardState.customColor ?? "brand";
  }

  if (cardState.playerViewPermission === PlayerViewPermission.Hidden) {
    props.background = "background";
  }

  return props;
}
