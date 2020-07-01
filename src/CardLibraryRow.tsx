import React, { useContext, useCallback } from "react";
import { ReducerContext } from "./ReducerContext";
import { Button } from "grommet";
import { Actions } from "./Actions";
import { CardState } from "./CardState";

export function CardLibraryRow(props: { card: CardState; }) {
  const { dispatch } = useContext(ReducerContext);

  const openCard = useCallback(
    () => dispatch(Actions.OpenCard({ cardId: props.card.cardId })),
    [dispatch, props.card.cardId]
  );

  return (
    <Button key={props.card.cardId} onClick={openCard}>
      {props.card.title}
    </Button>
  );
}
