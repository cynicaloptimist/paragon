import {
  faCheck,
  faFolder,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput } from "grommet";
import _ from "lodash";
import { useCallback, useContext, useRef, useState } from "react";
import { CardActions } from "../../actions/CardActions";
import { DashboardActions } from "../../actions/DashboardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { GetDashboard } from "../../state/AppState";
import { CardState } from "../../state/CardState";
import { LongPressButton } from "../common/LongPressButton";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { AddToCampaignIcon } from "./AddToCampaignIcon";

export function CardLibraryRow(props: {
  card: CardState;
  showFolder?: boolean;
}) {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const isCardOpen =
    GetDashboard(state, dashboardId)?.openCardIds?.includes(
      props.card.cardId
    ) || false;

  const showActiveCampaignButton =
    state.activeCampaignId &&
    !props.card.campaignId &&
    props.card.type !== "info";

  const openCard = useCallback(
    () =>
      dashboardId &&
      dispatch(
        DashboardActions.OpenCard({
          dashboardId,
          cardId: props.card.cardId,
          cardType: props.card.type,
        })
      ),
    [dispatch, dashboardId, props.card.cardId, props.card.type]
  );

  const closeCard = useCallback(() => {
    if (!dashboardId) {
      return console.error("No dashboard open");
    }
    dispatch(
      DashboardActions.CloseCard({
        cardId: props.card.cardId,
        dashboardId: dashboardId,
      })
    );
  }, [dispatch, dashboardId, props.card.cardId]);

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
      <Box
        onClick={openCard}
        flex
        justify="center"
        margin="xsmall"
        style={{ overflowX: "hidden" }}
      >
        {props.card.title}
      </Box>
      {showActiveCampaignButton && (
        <Button
          style={{ padding: "6px" }}
          tip="Move to Active Campaign"
          onClick={() =>
            dispatch(
              CardActions.SetCardCampaign({
                cardId: props.card.cardId,
                campaignId: state.activeCampaignId,
              })
            )
          }
          icon={<AddToCampaignIcon />}
        />
      )}
      {props.showFolder && (
        <Button
          style={{ padding: "6px" }}
          tip="Move to Folder"
          onClick={() => setEditingPath(true)}
          icon={<FontAwesomeIcon icon={faFolder} />}
        />
      )}
      {isCardOpen && (
        <Button
          style={{ padding: "6px" }}
          tip="Close Card"
          onClick={closeCard}
          icon={<FontAwesomeIcon icon={faTimes} />}
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
