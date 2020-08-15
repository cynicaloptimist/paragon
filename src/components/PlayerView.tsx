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
    idDbRef.once("value", (id) => {
      setPlayerViewUserId(id.val());
    });
  }, [playerViewId]);

  useEffect(() => {
    if (!playerViewUserId) {
      return;
    }
    const dbRef = database().ref(`users/${playerViewUserId}/playerViewState`);
    dbRef.on("value", (appState) => {
      const networkAppState: Partial<AppState> = appState.val();
      const completeAppState = {
        ...EmptyState(),
        ...networkAppState,
      };
      setState(completeAppState);
    });

    return () => dbRef.off();
  }, [playerViewUserId]);

  const dispatch = (action: RootAction) => {
    const cleanAction = removeUndefinedNodesFromTree(action);
    database().ref(`pendingActions/${state.playerViewId}`).push(cleanAction);
  };

  return [state, dispatch];
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
