import { Text } from "grommet";
import React from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";

export const CardLink = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
) => {
  const { state, dispatch } = React.useContext(ReducerContext);
  const cardId = props.href || "";
  if (!state.cardsById[cardId]) {
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
        dispatch(CardActions.OpenCard({ cardId }));
      }}
    >
      {props.children}
    </Text>
  );
};
