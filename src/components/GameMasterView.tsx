import "firebase/auth";
import { Box, Grommet } from "grommet";
import React from "react";
import { AppReducer } from "../reducers/AppReducer";
import { ReducerContext } from "../reducers/ReducerContext";
import { UpdateMissingOrLegacyAppState } from "../state/LegacyAppState";
import { Theme } from "../Theme";
import { CardGrid } from "./CardGrid";
import { useAccountSync } from "./hooks/useAccountSync";
import { useLogin } from "./hooks/useLogin";
import { usePlayerView } from "./hooks/usePlayerView";
import { useStorageBackedReducer } from "./hooks/useStorageBackedReducer";
import { LibrarySidebar } from "./LibrarySidebar";
import { TopBar } from "./TopBar";

export function GameMasterView() {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    UpdateMissingOrLegacyAppState,
    "appState"
  );

  useLogin(dispatch);
  usePlayerView(state, dispatch);
  useAccountSync(state, dispatch);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <Grommet style={{ minHeight: "100%" }} theme={Theme}>
        <Box fill align="center">
          <TopBar />
          <CardGrid />
          {state.librarySidebarMode !== "hidden" && <LibrarySidebar />}
        </Box>
      </Grommet>
    </ReducerContext.Provider>
  );
}
