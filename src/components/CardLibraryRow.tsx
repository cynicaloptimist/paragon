import { faCheck, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, ButtonType, TextInput } from "grommet";
import React, { useCallback, useContext, useRef, useState } from "react";
import { CardActions } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardState } from "../state/CardState";

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
    <Box flex={false} direction="row">
      <Button onClick={openCard} fill="horizontal">
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

function LongPressButton(
  props: Omit<ButtonType, "onClick"> & {
    timeout?: number;
    onLongPress: () => void;
  }
) {
  const [isPressed, setIsPressed] = useState(false);
  const isPressedRef = useRef(isPressed);
  isPressedRef.current = isPressed;

  const press = useCallback(() => {
    setIsPressed(true);
    setTimeout(() => {
      if (isPressedRef.current) {
        props.onLongPress();
      }
    }, props.timeout ?? 1000);
  }, [props, isPressedRef, setIsPressed]);

  const unPress = useCallback(() => {
    setIsPressed(false);
  }, [setIsPressed]);

  return (
    <Button
      {...props}
      className={(props.className ?? "") + (isPressed ? " pressed" : "")}
      onMouseDown={press}
      onMouseUp={unPress}
      onTouchStart={press}
      onTouchEnd={unPress}
      onTouchCancel={unPress}
    />
  );
}
