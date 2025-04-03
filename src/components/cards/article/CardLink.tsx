import { Anchor, Text, ThemeContext } from "grommet";
import React from "react";
import { DashboardActions } from "../../../actions/DashboardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";
import { useCardColor } from "../../hooks/useCardColor";

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

  const linkColor = useCardColor(card);

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
