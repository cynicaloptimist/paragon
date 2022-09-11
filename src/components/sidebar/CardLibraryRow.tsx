import { faCheck, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput } from "grommet";
import _ from "lodash";
import React, { useCallback, useContext, useRef, useState } from "react";
import { CardActions } from "../../actions/CardActions";
import { DashboardActions } from "../../actions/DashboardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { GetDashboard } from "../../state/AppState";
import { CardState } from "../../state/CardState";
import { LongPressButton } from "../common/LongPressButton";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";

export function CardLibraryRow(props: {
  card: CardState;
  showFolder?: boolean;
}) {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const isCardOpen =
    GetDashboard(state)?.openCardIds?.includes(props.card.cardId) || false;

  const card = state.cardsById[props.card.cardId];

  const openCard = useCallback(
    () =>
      dashboardId &&
      dispatch(
        DashboardActions.OpenCard({
          dashboardId,
          cardId: props.card.cardId,
          cardType: card.type,
        })
      ),
    [dispatch, dashboardId, props.card.cardId, card.type]
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
    const existingPathSuggestions = _.uniq(
      Object.values(state.cardsById).map((c) => c.path)
    )
      .filter((path) => path && path.length > 0)
      .sort()
      .map((path) => {
        return {
          label: path,
          value: path,
        };
      });

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
          suggestions={existingPathSuggestions}
          onSuggestionSelect={(selectEvent) => {
            if (!pathInput.current) {
              return;
            }
            pathInput.current.value = selectEvent.suggestion.value;
            saveAndClose();
          }}
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
      {props.showFolder && (
        <Button
          tip="Move to Folder"
          onClick={() => setEditingPath(true)}
          icon={<FontAwesomeIcon icon={faFolder} />}
        />
      )}
      {props.card.type !== "info" && (
        <LongPressButton
          tip="Delete"
          onLongPress={deleteCard}
          icon={<FontAwesomeIcon icon={faTrash} />}
        />
      )}
    </Box>
  );
}
