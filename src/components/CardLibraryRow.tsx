import React, { useContext, useCallback } from "react";
import { ReducerContext } from "../reducers/ReducerContext";
import { Button, Box } from "grommet";
import { CardActions } from "../actions/Actions";
import { CardState } from "../state/CardState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export function CardLibraryRow(props: { card: CardState }) {
  const { dispatch } = useContext(ReducerContext);

  const openCard = useCallback(
    () => dispatch(CardActions.OpenCard({ cardId: props.card.cardId })),
    [dispatch, props.card.cardId]
  );

  const deleteCard = useCallback(
    () => dispatch(CardActions.DeleteCard({ cardId: props.card.cardId })),
    [dispatch, props.card.cardId]
  );

  return (
    <Box flex={false} key={props.card.cardId} direction="row">
      <Button onClick={openCard} fill="horizontal">
        {props.card.title}
      </Button>
      <Button onClick={deleteCard} icon={<FontAwesomeIcon icon={faTrash} />} />
    </Box>
  );
}
