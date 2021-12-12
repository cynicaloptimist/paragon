import { faCheck, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput } from "grommet";
import React, { useCallback, useContext, useRef, useState } from "react";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { ActiveDashboardOf } from "../../state/AppState";
import { CardState } from "../../state/CardState";
import { LongPressButton } from "../common/LongPressButton";

export function CardLibraryRow(props: { card: CardState }) {
  const { state, dispatch } = useContext(ReducerContext);

  const isCardOpen =
    ActiveDashboardOf(state)?.openCardIds?.includes(props.card.cardId) || false;

  const openCard = useCallback(
    () => dispatch(CardActions.OpenCard({ cardId: props.card.cardId })),
    [dispatch, props.card.cardId]
  );

  const deleteCard = useCallback(() => {
    dispatch(CardActions.DeleteCard({ cardId: props.card.cardId }));
  }, [dispatch, props.card.cardId]);

  const [editingPath, setEditingPath] = useState(false);
  const pathInput = useRef<HTMLInputElement>(null);

  const saveAndClose = () => {
    dispatch(
      CardActions.SetCardPath({
        cardId: props.card.cardId,
        path: pathInput.current?.value || "",
      })
    );
    setEditingPath(false);
  };

  if (editingPath) {
    return (
      <Box flex={false} direction="row" align="center">
        <Box margin="small">
          <FontAwesomeIcon icon={faFolder} />
        </Box>
        <TextInput
          ref={pathInput}
          defaultValue={props.card.path}
          onKeyDown={(keyEvent) => {
            if (keyEvent.key === "Enter") {
              saveAndClose();
            }
          }}
          autoFocus
          onBlur={saveAndClose}
        />
        <Button
          tip="Move to Folder"
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
      <Button
        onClick={openCard}
        fill="horizontal"
        margin="xsmall"
        style={{ overflowX: "hidden" }}
      >
        {props.card.title}
      </Button>
      <Button
        tip="Move to Folder"
        onClick={() => setEditingPath(true)}
        icon={<FontAwesomeIcon icon={faFolder} />}
      />
      <LongPressButton
        tip="Delete"
        onLongPress={deleteCard}
        icon={<FontAwesomeIcon icon={faTrash} />}
      />
    </Box>
  );
}
