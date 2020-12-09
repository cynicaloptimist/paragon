import { database } from "firebase/app";
import "firebase/database";
import { Box, Grommet } from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RootAction } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";
import { AppState, EmptyState } from "../state/AppState";
import { Theme } from "../Theme";
import { CardGrid } from "./CardGrid";
import { removeUndefinedNodesFromTree } from "./hooks/removeUndefinedNodesFromTree";
import { PlayerViewContext } from "./PlayerViewContext";
import { PlayerViewTopBar } from "./PlayerViewTopBar";

function useRemoteState(
  playerViewId: string
): [AppState, React.Dispatch<RootAction>] {
  const [state, setState] = useState(EmptyState());
  const [playerViewUserId, setPlayerViewUserId] = useState<string | null>(null);

  useEffect(() => {
    const idDbRef = database().ref(
      `playerViews/${playerViewId.toLocaleLowerCase()}`
    );

    idDbRef.on("value", (id) => {
      setPlayerViewUserId(id.val());
    });

    return () => idDbRef.off();
  }, [playerViewId]);

  useEffect(() => {
    if (!playerViewUserId) {
      return;
    }
    const dbRef = database().ref(
      `users/${playerViewUserId}/playerViews/${playerViewId}`
    );
    dbRef.on("value", (appState) => {
      const networkAppState: Partial<AppState> = appState.val();
      if (!networkAppState) {
        return;
      }
      const completeAppState = restorePrunedEmptyArrays(networkAppState);
      setState(completeAppState);
    });

    return () => dbRef.off();
  }, [playerViewId, playerViewUserId]);

  const dispatch = (action: RootAction) => {
    const cleanAction = removeUndefinedNodesFromTree(action);
    database()
      .ref(`pendingActions/${state.activeDashboardId}`)
      .push(cleanAction);
  };

  return [state, dispatch];
}

function restorePrunedEmptyArrays(
  networkAppState: Partial<AppState>
): AppState {
  for (const dashboard of Object.values(networkAppState.dashboardsById || {})) {
    dashboard.layouts = dashboard.layouts || [];
    dashboard.openCardIds = dashboard.openCardIds || [];
  }

  return {
    ...EmptyState(),
    ...networkAppState,
  };
}

export function PlayerView() {
  const { playerViewId } = useParams<{ playerViewId: string }>();
  const [state, dispatch] = useRemoteState(playerViewId);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <PlayerViewContext.Provider value={{ playerViewId: playerViewId }}>
        <Grommet style={{ minHeight: "100%" }} theme={Theme}>
          <Box fill align="center">
            <PlayerViewTopBar />
            <CardGrid />
          </Box>
        </Grommet>
      </PlayerViewContext.Provider>
    </ReducerContext.Provider>
  );
}
