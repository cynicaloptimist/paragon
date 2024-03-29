import { Text } from "grommet";
import React from "react";
import { DashboardActions } from "../../../actions/DashboardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";

export const CardLink = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) => {
  const { state, dispatch } = React.useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const cardId = props.href || "";
  const card = state.cardsById[cardId];
  if (!card) {
    return (
      <a {...props} target="_blank">
        {props.children}
      </a>
    );
  }
  return (
    <Text
      color="link"
      style={{ textDecoration: "underline", cursor: "pointer" }}
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
