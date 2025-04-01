import { Anchor, Text, ThemeContext } from "grommet";
import React from "react";
import { DashboardActions } from "../../../actions/DashboardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";
import { themeColor } from "../../hooks/useThemeColor";

export const CardLink = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) => {
  const { state, dispatch } = React.useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const cardId = props.href || "";
  const card = state.cardsById[cardId];
  const theme = React.useContext(ThemeContext);

  if (!card) {
    return (
      <Anchor {...props} target="_blank" color="link">
        {props.children}
      </Anchor>
    );
  }

  let linkColor = themeColor(theme, "brand");

  if (card.themeColor) {
    if (card.themeColor === "custom" && card.customColor) {
      linkColor = card.customColor;
    }
    if (card.themeColor !== "custom") {
      linkColor = themeColor(theme, card.themeColor);
    }
  }

  return (
    <Text
      color="link"
      weight="bold"
      style={{
        cursor: "pointer",
        textDecoration: "underline",
        textDecorationColor: linkColor,
      }}
      onClick={() => {
        dashboardId &&
          dispatch(
            DashboardActions.OpenCard({
              dashboardId,
              cardId,
              cardType: card.type,
            })
          );
      }}
    >
      {props.children}
    </Text>
  );
};
