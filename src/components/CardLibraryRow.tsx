import { faCheck, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput } from "grommet";
import React, { useCallback, useContext, useState } from "react";
import { CardActions } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";
import { ActiveDashboardOf } from "../state/AppState";
import { CardState } from "../state/CardState";
import { LongPressButton } from "./LongPressButton";

export function CardLibraryRow(props: { card: CardState }) {
  const { state, dispatch } = useContext(ReducerContext);

  const isCardOpen =
    ActiveDashboardOf(state)?.openCardIds.includes(props.card.cardId) || false;

  const openCard = useCallback(
    () => dispatch(CardActions.OpenCard({ cardId: props.card.cardId })),
    [dispatch, props.card.cardId]
  );

  const deleteCard = useCallback(() => {
    dispatch(CardActions.DeleteCard({ cardId: props.card.cardId }));
  }, [dispatch, props.card.cardId]);

  const [editingPath, setEditingPath] = useState(false);
  const [pathInput, setPathInput] = useState("");
  const saveAndClose = () => {
    dispatch(
      CardActions.SetCardPath({ cardId: props.card.cardId, path: pathInput })
    );
    setEditingPath(false);
    setPathInput("");
  };

  if (editingPath) {
    return (
      <Box flex={false} direction="row">
        <TextInput
          defaultValue={props.card.path}
          onChange={(changeEvent) => setPathInput(changeEvent.target.value)}
          onKeyDown={(keyEvent) => {
            if (keyEvent.key === "Enter") {
              saveAndClose();
            }
          }}
          autoFocus
          onBlur={saveAndClose}
        />
        <Button
          onClick={() => setEditingPath(false)}
          icon={<FontAwesomeIcon icon={faCheck} />}
        />
      </Box>
    );
  }

  return (
    <Box
      flex={false}
      direction="row"
      background={{
        color: isCardOpen ? "brand-2" : "transparent",
      }}
    >
      <Button onClick={openCard} fill="horizontal" margin="xsmall">
        {props.card.title}
      </Button>
      <Button
        onClick={() => setEditingPath(true)}
        icon={<FontAwesomeIcon icon={faFolder} />}
      />
      <LongPressButton
        onLongPress={deleteCard}
        icon={<FontAwesomeIcon icon={faTrash} />}
      />
    </Box>
  );
}
