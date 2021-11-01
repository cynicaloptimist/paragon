import "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "firebase/database";
import {
  getDatabase,
  off,
  onChildAdded,
  ref,
  remove,
  set,
} from "firebase/database";
import pickBy from "lodash/pickBy";
import { useEffect, useRef, useState } from "react";
import { isActionOf } from "typesafe-actions";
import { app } from "../..";
import { RootAction } from "../../actions/Actions";
import { CardActions } from "../../actions/CardActions";
import { AppState } from "../../state/AppState";
import { PlayerViewPermission } from "../../state/CardState";
import { removeUndefinedNodesFromTree } from "./removeUndefinedNodesFromTree";
import { useUserId } from "./useAccountSync";

function omitClosedCardsFromState(fullState: AppState): AppState {
  if (fullState.activeDashboardId == null) {
    return {
      ...fullState,
      cardsById: {},
    };
  }

  const dashboard = fullState.dashboardsById[fullState.activeDashboardId];

  if (!dashboard) {
    return {
      ...fullState,
      cardsById: {},
      dashboardsById: {},
    };
  }

  const visibleCardIds =
    dashboard.openCardIds?.filter(
      (cardId) =>
        fullState.cardsById[cardId].playerViewPermission !==
        PlayerViewPermission.Hidden
    ) || [];

  return {
    ...fullState,
    cardsById: pickBy(fullState.cardsById, (_, cardId) =>
      visibleCardIds.some((visibleCardId) => visibleCardId === cardId)
    ),
    dashboardsById: {
      [fullState.activeDashboardId]: {
        ...dashboard,
        openCardIds: visibleCardIds,
        layouts: dashboard.layouts?.filter((layout) =>
          visibleCardIds.includes(layout.i)
        ),
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
            CardActions.SetRollTableLastRoll,
            CardActions.SetRollTableEntries,
            CardActions.SetClockValue,
            CardActions.SetClockMax,
            CardActions.SetClockDisplayType,
          ],
          action
        )
      ) {
        dispatch(action);
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
      removeUndefinedNodesFromTree(state)
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
  }, [state, userId]);
}
