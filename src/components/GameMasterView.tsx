import { Box, Grommet } from "grommet";
import React from "react";
import { AppReducer } from "../reducers/AppReducer";
import { ReducerContext } from "../reducers/ReducerContext";
import { GetInitialState } from "../state/AppState";
import { Theme } from "../Theme";
import { CardGrid } from "./CardGrid";
import { CardLibrary } from "./CardLibrary";
import { usePlayerView } from "./hooks/usePlayerView";
import { useStorageBackedReducer } from "./hooks/useStorageBackedReducer";
import { TopBar } from "./TopBar";


export function GameMasterView() {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    GetInitialState(),
    "appState"
  );

  usePlayerView(state);

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
