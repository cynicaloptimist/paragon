import "firebase/auth";
import { Box, Grommet } from "grommet";
import { useCallback, useEffect } from "react";
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
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { useHistory } from "react-router-dom";
import { randomString } from "../../randomString";
import { DashboardActions } from "../../actions/DashboardActions";
import { UIContext, useUIContextState } from "../UIContext";
import { AppSettings } from "./AppSettings";
import { usePageTitleFromActiveDashboardName } from "../hooks/usePageTitle";
import _ from "lodash";

export default function GameMasterView() {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    UpdateMissingOrLegacyAppState,
    "appState"
  );
  const history = useHistory();

  useLogin(dispatch);
  usePlayerView(state, dispatch);
  const dashboardId = useActiveDashboardId();
  usePageTitleFromActiveDashboardName(state);

  useEffect(() => {
    if (dashboardId) {
      dispatch(
        DashboardActions.ActivateDashboard({
          dashboardId: dashboardId,
          currentTimeMs: Date.now(),
        })
      );
    }
  }, [dashboardId, dispatch]);

  const uiContext = useUIContextState();

  const onDashboardsLoaded = useCallback(
    (dashboardIds: string[]) => {
      if (!dashboardId) {
        const sortedIds = _.sortBy(
          Object.keys(state.dashboardsById),
          (d) => -(state.dashboardsById[d].lastOpenedTimeMs || 0)
        );
        const mostRecentDashboardId = sortedIds[0];

        if (mostRecentDashboardId) {
          history.replace(`/e/${mostRecentDashboardId}`);
        } else {
          const newDashboardId = randomString();
          dispatch(
            DashboardActions.CreateDashboard({ dashboardId: newDashboardId })
          );
          history.replace(`/e/${newDashboardId}`);
        }
        return;
      }

      if (!dashboardIds.includes(dashboardId)) {
        history.replace(`/d/${dashboardId}`);
      }
    },
    [dashboardId, dispatch, history, state.dashboardsById]
  );

  useAccountSync(state, dispatch, onDashboardsLoaded);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <UIContext.Provider value={uiContext}>
        <Grommet style={{ minHeight: "100%" }} theme={Theme}>
          <Box fill align="center">
            <TopBar />
            <CardGrid />
            {uiContext.librarySidebarMode !== "hidden" && <LibrarySidebar />}
            {uiContext.appSettingsVisible && <AppSettings />}
          </Box>
        </Grommet>
      </UIContext.Provider>
    </ReducerContext.Provider>
  );
}
