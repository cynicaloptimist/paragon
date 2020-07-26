import React, { useState, useEffect } from "react";

import { database } from "firebase/app";
import "firebase/database";

import { ReducerContext } from "../reducers/ReducerContext";
import { Grommet, Box } from "grommet";
import { Theme } from "../Theme";
import { CardGrid } from "./CardGrid";
import { EmptyState, AppState } from "../state/AppState";
import { useParams } from "react-router-dom";
import { PlayerViewContext } from "./PlayerViewContext";
import { PlayerViewTopBar } from "./PlayerViewTopBar";

function useRemoteState(playerViewId: string) {
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

  return state;
}

export function PlayerView() {
  const { playerViewId } = useParams<{ playerViewId: string }>();
  const state = useRemoteState(playerViewId);

  return (
    <ReducerContext.Provider value={{ state, dispatch: () => {} }}>
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
