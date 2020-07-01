import React, { useState, useEffect } from "react";

import { database } from "firebase/app";
import "firebase/database";

import { ReducerContext } from "./ReducerContext";
import { Grommet, Box } from "grommet";
import { Theme } from "./Theme";
import { TopBar } from "./TopBar";
import { CardGrid } from "./CardGrid";
import { GetInitialState, AppState } from "./AppState";

function useRemoteState() {
  const [state, setState] = useState(GetInitialState());
  useEffect(() => {
    const dbRef = database().ref("playerviews/test");
    dbRef.on("value", (appState) => {
      const networkAppState: Partial<AppState> = appState.val().state;
      const completeAppState = {
        ...GetInitialState(),
        ...networkAppState,
      };
      setState(completeAppState);
    });

    return () => dbRef.off();
  }, []);
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
