import { getDatabase, off, onValue, ref } from "firebase/database";
import { Box, Grommet } from "grommet";
import { useEffect, useReducer, useState } from "react";
import { AppReducer } from "../../reducers/AppReducer";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState } from "../../state/AppState";
import { Theme } from "../../Theme";
import { CardGrid } from "./CardGrid";
import { SharedDashboardViewTopBar } from "../topbar/SharedDashboardViewTopBar";
import { FirebaseUtils } from "../../FirebaseUtils";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";
import {
  LegacyAppState,
  UpdateMissingOrLegacyAppState,
} from "../../state/LegacyAppState";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { usePageTitleFromActiveDashboardName } from "../hooks/usePageTitle";

function useStateFromSharedDashboard(dashboardId: string | null) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    if (!dashboardId) {
      return;
    }
    const database = getDatabase();
    const dbRef = ref(database, `shared/${dashboardId}`);

    onValue(dbRef, (appState) => {
      const networkLegacyAppState: Partial<LegacyAppState> = appState.val();
      if (!networkLegacyAppState) {
        return;
      }
      off(dbRef);

      const networkAppState = UpdateMissingOrLegacyAppState(
        networkLegacyAppState
      );
      const completeAppState =
        FirebaseUtils.restorePrunedEmptyArrays(networkAppState);
      setState(completeAppState);
    });

    return () => off(dbRef);
  }, [dashboardId]);

  return state;
}

export function SharedDashboardView() {
  const dashboardId = useActiveDashboardId();

  const state = useStateFromSharedDashboard(dashboardId);

  if (!state) {
    return (
      <Grommet style={{ minHeight: "100%" }} theme={Theme}>
        <Box fill align="center">
          <SharedDashboardViewTopBar />
        </Box>
      </Grommet>
    );
  }

  return <SharedDashboardViewWithState loadedState={state} />;
}

export function SharedDashboardViewWithState(props: { loadedState: AppState }) {
  const [state, dispatch] = useReducer(AppReducer, props.loadedState);

  usePageTitleFromActiveDashboardName(state);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <ViewTypeContext.Provider value={ViewType.Dashboard}>
        <Grommet style={{ minHeight: "100%" }} theme={Theme}>
          <Box fill align="center">
            <SharedDashboardViewTopBar />
            <CardGrid />
          </Box>
        </Grommet>
      </ViewTypeContext.Provider>
    </ReducerContext.Provider>
  );
}
