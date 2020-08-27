import { faCheck, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, ButtonType, Meter, Stack, TextInput } from "grommet";
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

const DRAW_INTERVAL = 20;

function LongPressButton(
  props: Omit<ButtonType, "onClick"> & {
    timeout?: number;
    onLongPress: () => void;
  }
) {
  const { onLongPress, ...buttonProps } = props;
  const timeout = props.timeout || 1000;

  const [pressLength, setPressLength] = useState(0);
  const pressLengthRef = useRef(pressLength);
  pressLengthRef.current = pressLength;

  const interval = useRef<NodeJS.Timeout>();

  const press = useCallback(() => {
    if (!interval.current) {
      interval.current = setInterval(() => {
        if (pressLengthRef.current > timeout) {
          onLongPress();
        } else {
          setPressLength(pressLengthRef.current + DRAW_INTERVAL);
        }
      }, DRAW_INTERVAL);
    }
  }, [onLongPress, timeout]);

  const unPress = useCallback(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
    setPressLength(0);
  }, [interval, setPressLength]);

  return (
    <Stack anchor="center">
      <Meter
        type="circle"
        max={timeout}
        values={[
          {
            value: pressLength,
            color: "status-warning",
          },
        ]}
        size="xxsmall"
        thickness="xsmall"
        margin={{
          top: "5px",
        }}
      />
      <Button
        {...buttonProps}
        onMouseDown={press}
        onMouseUp={unPress}
        onMouseLeave={unPress}
        onTouchStart={press}
        onTouchEnd={unPress}
        onTouchCancel={unPress}
      />
    </Stack>
  );
}
