import { faCheck, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  ButtonType,
  TextInput,
  ThemeContext,
  ThemeType
} from "grommet";
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
  const { onLongPress, ...buttonProps } = props;

  const [isPressed, setIsPressed] = useState(false);
  const isPressedRef = useRef(isPressed);
  isPressedRef.current = isPressed;

  const press = useCallback(() => {
    setIsPressed(true);
    setTimeout(() => {
      if (isPressedRef.current) {
        onLongPress();
      }
    }, props.timeout ?? 1500);
  }, [onLongPress, isPressedRef, setIsPressed, props.timeout]);

  const unPress = useCallback(() => {
    setIsPressed(false);
  }, [setIsPressed]);

  const theme: ThemeType = {
    button: {
      default: {
        background: {
          color: isPressed ? "status-warning" : "inherit",
        },
      },
      transition: {
        properties: ["background-color"],
        duration: 1.5,
        timing: "linear",
      },
    },
  };

  return (
    <ThemeContext.Extend value={theme}>
      <Button
        {...buttonProps}
        onMouseDown={press}
        onMouseUp={unPress}
        onMouseLeave={unPress}
        onTouchStart={press}
        onTouchEnd={unPress}
        onTouchCancel={unPress}
      />
    </ThemeContext.Extend>
  );
}
