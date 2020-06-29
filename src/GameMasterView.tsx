import React from "react";

import { TopBar } from "./TopBar";
import { AppReducer } from "./AppReducer";
import { GetInitialState } from "./AppState";
import { ReducerContext } from "./ReducerContext";
import { Grommet, Box } from "grommet";
import { useStorageBackedReducer } from "./useStorageBackedReducer";
import { CardGrid } from "./CardGrid";
import { Theme } from "./Theme";
import { useServerStateUpdates } from "./useServerStateUpdates";
import { CardLibrary } from "./CardLibrary";

export function GameMasterView() {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    GetInitialState(),
    "appState"
  );

  useServerStateUpdates(state);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <Grommet style={{ minHeight: "100%" }} theme={Theme}>
        <Box fill align="center">
          <Box fill="vertical" width="1200px">
            <TopBar />
            <CardGrid />
            <CardLibrary />
          </Box>
        </Box>
      </Grommet>
    </ReducerContext.Provider>
  );
}
