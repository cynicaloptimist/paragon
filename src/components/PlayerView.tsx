import React, { useState, useEffect } from "react";

import { database } from "firebase/app";
import "firebase/database";

import { ReducerContext } from "../reducers/ReducerContext";
import { Grommet, Box } from "grommet";
import { Theme } from "../Theme";
import { TopBar } from "./TopBar";
import { CardGrid } from "./CardGrid";
import { GetInitialState, AppState } from "../state/AppState";
import { useParams } from "react-router-dom";

function useRemoteState() {
  const [state, setState] = useState(GetInitialState());
  const { playerViewId } = useParams<{ playerViewId: string }>();
  const [playerViewUserId, setPlayerViewUserId] = useState<string | null>(null);

  useEffect(() => {
    const idDbRef = database().ref(
      `playerViews/${playerViewId.toLocaleLowerCase()}`
    );
    idDbRef.once("value", (id) => {
      setPlayerViewUserId(id.val());
    });
  }, []);

  useEffect(() => {
    if (!playerViewUserId) {
      return;
    }
    const dbRef = database().ref(`users/${playerViewUserId}/playerViewState`);
    dbRef.on("value", (appState) => {
      const networkAppState: Partial<AppState> = appState.val();
      const completeAppState = {
        ...GetInitialState(),
        ...networkAppState,
      };
      setState(completeAppState);
    });

    return () => dbRef.off();
  }, [playerViewUserId]);

  return state;
}

export function PlayerView() {
  const state = useRemoteState();

  return (
    <ReducerContext.Provider value={{ state, dispatch: () => {} }}>
      <Grommet style={{ height: "100%" }} theme={Theme}>
        <Box fill align="center">
          <Box fill="vertical" width="1200px">
            <TopBar />
            <CardGrid />
          </Box>
        </Box>
      </Grommet>
    </ReducerContext.Provider>
  );
}
