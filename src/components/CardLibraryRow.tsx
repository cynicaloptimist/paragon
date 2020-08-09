import React, { useContext, useCallback, useState } from "react";
import { ReducerContext } from "../reducers/ReducerContext";
import { Button, Box, TextInput } from "grommet";
import { CardActions } from "../actions/Actions";
import { CardState } from "../state/CardState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFolder, faCheck } from "@fortawesome/free-solid-svg-icons";

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
      <Box flex={false} key={props.card.cardId} direction="row">
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
    <Box flex={false} key={props.card.cardId} direction="row">
      <Button onClick={openCard} fill="horizontal">
        {props.card.title}
      </Button>
      <Button
        onClick={() => setEditingPath(true)}
        icon={<FontAwesomeIcon icon={faFolder} />}
      />
      <Button onClick={deleteCard} icon={<FontAwesomeIcon icon={faTrash} />} />
    </Box>
  );
}
