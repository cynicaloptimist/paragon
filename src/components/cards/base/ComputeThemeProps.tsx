import { BoxProps } from "grommet";
import { CardState, PlayerViewPermission } from "../../../state/CardState";

export function ComputeThemeProps(cardState: CardState): BoxProps {
  const props = {
    border: { color: "brand", size: "medium" },
    background: "brand",
  };

  if (cardState.playerViewPermission === PlayerViewPermission.Hidden) {
    props.background = "background";
  }

  return props;
}
