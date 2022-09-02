import "firebase/auth";
import { Box, Grommet } from "grommet";
import React from "react";
import { AppReducer } from "../../reducers/AppReducer";
import { ReducerContext } from "../../reducers/ReducerContext";
import { UpdateMissingOrLegacyAppState } from "../../state/LegacyAppState";
import { Theme } from "../../Theme";
import { CardGrid } from "./CardGrid";
import { useAccountSync } from "../hooks/useAccountSync";
import { useLogin } from "../hooks/useLogin";
import { usePlayerView } from "../hooks/usePlayerView";
import { useStorageBackedReducer } from "../hooks/useStorageBackedReducer";
import { LibrarySidebar } from "../sidebar/LibrarySidebar";
import { TopBar } from "../topbar/TopBar";
import { useParams } from "react-router-dom";
import { Actions } from "../../actions/Actions";

export function GameMasterView() {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    UpdateMissingOrLegacyAppState,
    "appState"
  );

  useLogin(dispatch);
  usePlayerView(state, dispatch);
  useAccountSync(state, dispatch);
  const { dashboardId } = useParams<{ dashboardId: string | undefined }>();
  if (dashboardId !== undefined) {
    if (
      state.activeDashboardId !== dashboardId &&
      state.dashboardsById[dashboardId] !== undefined
    ) {
      dispatch(Actions.ActivateDashboard({ dashboardId }));
    }
  }

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
