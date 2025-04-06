import { Anchor, Text, ThemeContext } from "grommet";
import React, { useContext } from "react";
import { DashboardActions } from "../../../actions/DashboardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";
import { useCardColor } from "../../hooks/useCardColor";
import { GetDashboard } from "../../../state/AppState";
import { UIContext } from "../../UIContext";

export const CardLink = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) => {
  const { state, dispatch } = React.useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const cardId = props.href || "";
  const card = state.cardsById[cardId];
  const { cardRefsById } = useContext(UIContext);

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
        const dashboard = GetDashboard(state, dashboardId);
        if (!dashboard || !dashboardId) {
          return;
        }

        if (dashboard.openCardIds?.includes(cardId)) {
          if (cardRefsById[cardId]?.current) {
            cardRefsById[cardId].current.focus();
          }
        } else {
          dispatch(
            DashboardActions.OpenCard({
              dashboardId,
              cardId,
              cardType: card.type,
            })
          );
        }
      }}
    >
      {props.children}
    </Text>
  );
};
