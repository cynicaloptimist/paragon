import { auth, database } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import pickBy from "lodash/pickBy";
import { useEffect, useRef, useState } from "react";
import { isActionOf } from "typesafe-actions";
import { Actions, RootAction } from "../../actions/Actions";
import { CardActions } from "../../actions/CardActions";
import { AppState } from "../../state/AppState";
import { PlayerViewPermission } from "../../state/CardState";
import { removeUndefinedNodesFromTree } from "./removeUndefinedNodesFromTree";

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

  const visibleCardIds = dashboard.openCardIds.filter(
    (cardId) =>
      fullState.cardsById[cardId].playerViewPermission !==
      PlayerViewPermission.Hidden
  );

  return {
    ...fullState,
    cardsById: pickBy(fullState.cardsById, (_, cardId) =>
      visibleCardIds.some((visibleCardId) => visibleCardId === cardId)
    ),
    dashboardsById: {
      [fullState.activeDashboardId]: {
        ...dashboard,
        openCardIds: visibleCardIds,
        layouts: dashboard.layouts.filter((layout) =>
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
  const [userId, setUserId] = useState<string | null>(null);
  const previousState = useRef(state);

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
  });

  useEffect(() => {
    if (!userId) {
      return;
    }

    const dbRef = database().ref(`playerViews/${state.activeDashboardId}`);
    dbRef.set(userId);

    const pendingActionsRef = database().ref(
      `pendingActions/${state.activeDashboardId}`
    );

    pendingActionsRef.on("child_added", (actionSnapshot) => {
      const action: RootAction = actionSnapshot.val();
      if (isActionOf(Actions.SetLayouts, action)) {
        if (action.payload) {
          dispatch(action);
        }
      }
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
      actionSnapshot.ref.remove();
    });

    const cleanup = () => {
      pendingActionsRef.off();
    };

    return cleanup;
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
      const dbRef = database().ref(
        `users/${userId}/playerViews/${state.activeDashboardId}`
      );
      dbRef.set(playerViewState);
      previousState.current = playerViewState;
    }
  }, [state, userId]);
}
