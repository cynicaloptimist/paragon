import { getDatabase, off, onValue, ref } from "firebase/database";
import { Box, Grommet } from "grommet";
import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { AppReducer } from "../../reducers/AppReducer";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState } from "../../state/AppState";
import { Theme } from "../../Theme";
import { CardGrid } from "./CardGrid";
import { DashboardViewTopBar } from "../topbar/DashboardViewTopBar";
import { restorePrunedEmptyArrays } from "../restorePrunedEmptyArrays";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";

function useStateFromSharedDashboard(dashboardId: string) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const database = getDatabase();
    const dbRef = ref(database, `shared/${dashboardId}`);

    onValue(dbRef, (appState) => {
      const networkAppState: Partial<AppState> = appState.val();
      if (!networkAppState) {
        return;
      }
      off(dbRef);
      const completeAppState = restorePrunedEmptyArrays(networkAppState);
      setState(completeAppState);
    });

    return () => off(dbRef);
  }, [dashboardId]);

  return state;
}

export function DashboardView() {
  const { dashboardId } = useParams<{ dashboardId: string }>();

  const state = useStateFromSharedDashboard(dashboardId);
  if (!state) {
    return (
      <Grommet style={{ minHeight: "100%" }} theme={Theme}>
        <Box fill align="center">
          <DashboardViewTopBar />
        </Box>
      </Grommet>
    );
  }

  return <DashboardViewWithState loadedState={state} />;
}

export function DashboardViewWithState(props: { loadedState: AppState }) {
  const [state, dispatch] = useReducer(AppReducer, props.loadedState);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <ViewTypeContext.Provider value={ViewType.Dashboard}>
        <Grommet style={{ minHeight: "100%" }} theme={Theme}>
          <Box fill align="center">
            <DashboardViewTopBar />
            <CardGrid />
          </Box>
        </Grommet>
      </ViewTypeContext.Provider>
    </ReducerContext.Provider>
  );
}
