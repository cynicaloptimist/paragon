import "firebase/auth";
import "firebase/database";
import {
  getDatabase,
  off,
  onChildAdded,
  ref,
  remove,
  set,
} from "firebase/database";
import _ from "lodash";
import pickBy from "lodash/pickBy";
import { useEffect, useRef } from "react";
import { isActionOf } from "typesafe-actions";
import { app } from "../..";
import { RootAction } from "../../actions/Actions";
import { CardActions } from "../../actions/CardActions";
import { GetDashboard, AppState, GetVisibleCards } from "../../state/AppState";
import { PlayerViewPermission } from "../../state/CardState";
import { FirebaseUtils } from "../../FirebaseUtils";
import { useUserId } from "./useAccountSync";
import { useActiveDashboardId } from "./useActiveDashboardId";

function omitClosedCardsFromState(
  fullState: AppState,
  dashboardId: string | null
): AppState {
  if (fullState.activeDashboardId == null) {
    return {
      ...fullState,
      cardsById: {},
    };
  }

  const dashboard = GetDashboard(fullState, dashboardId);

  if (!dashboard) {
    return {
      ...fullState,
      cardsById: {},
      dashboardsById: {},
    };
  }

  const visibleCards =
    GetVisibleCards(fullState, dashboardId).filter(
      (card) => card.playerViewPermission !== PlayerViewPermission.Hidden
    ) || [];

  const visibleCardIds = visibleCards.map((card) => card.cardId);

  return {
    ...fullState,
    cardsById: pickBy(fullState.cardsById, (_, cardId) =>
      visibleCards.some((card) => card.cardId === cardId)
    ),
    dashboardsById: {
      [fullState.activeDashboardId]: {
        ...dashboard,
        openCardIds: visibleCardIds,
        layoutsBySize: _.mapValues(dashboard.layoutsBySize, (layout) => {
          return layout.filter((layout) => visibleCardIds.includes(layout.i));
        }),
      },
    },
  };
}

export function usePlayerView(
  state: AppState,
  dispatch: React.Dispatch<RootAction>
) {
  const previousState = useRef(state);

  const userId = useUserId();
  const dashboardId = useActiveDashboardId();

  useEffect(() => {
    if (!userId) {
      return;
    }

    const database = getDatabase(app);
    const dbRef = ref(database, `playerViews/${state.activeDashboardId}`);
    set(dbRef, userId);

    const pendingActionsRef = ref(
      database,
      `pendingActions/${state.activeDashboardId}`
    );

    onChildAdded(pendingActionsRef, (actionSnapshot) => {
      const action: RootAction = actionSnapshot.val();
      if (
        isActionOf(
          [
            CardActions.SetCardContent,
            CardActions.RollDiceExpression,
            CardActions.SetImageUrl,
            CardActions.PushRollTableHistory,
            CardActions.SetRollTableEntries,
            CardActions.SetClockValue,
            CardActions.SetClockMax,
            CardActions.SetClockDisplayType,
            CardActions.AddLedgerEntry,
            CardActions.RemoveLedgerEntry,
            CardActions.SetLedgerUnits,
            CardActions.SetLedgerDecreasing,
            CardActions.SetSceneElements,
            CardActions.SetPDF,
          ],
          action
        )
      ) {
        dispatch(action);
      } else {
        console.warn("Action not permitted in Player View: ", action.type);
      }
      remove(actionSnapshot.ref);
    });

    return () => off(pendingActionsRef);
  }, [userId, state.activeDashboardId, dispatch]);

  useEffect(() => {
    if (!userId || !state.activeDashboardId) {
      return;
    }

    const playerViewState = omitClosedCardsFromState(
      FirebaseUtils.removeUndefinedNodesFromTree(state),
      dashboardId
    );

    if (
      JSON.stringify(previousState.current) !== JSON.stringify(playerViewState)
    ) {
      const database = getDatabase(app);
      const dbRef = ref(
        database,
        `users/${userId}/playerViews/${state.activeDashboardId}`
      );
      set(dbRef, playerViewState);
      previousState.current = playerViewState;
    }
  }, [state, userId, dashboardId]);
}
