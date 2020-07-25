import React from "react";
import "firebase/auth";

import { TopBar } from "./TopBar";
import { AppReducer } from "../reducers/AppReducer";
import { GetInitialState } from "../state/AppState";
import { ReducerContext } from "../reducers/ReducerContext";
import { Grommet, Box } from "grommet";
import { useStorageBackedReducer } from "./hooks/useStorageBackedReducer";
import { CardGrid } from "./CardGrid";
import { Theme } from "../Theme";
import { useServerStateUpdates } from "./hooks/useServerStateUpdates";
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
          <TopBar />
          <CardGrid />
          {state.cardLibraryVisibility && <CardLibrary />}
        </Box>
      </Grommet>
    </ReducerContext.Provider>
  );
}
