import { database } from "firebase";
import { Box, Grommet } from "grommet";
import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { AppReducer } from "../reducers/AppReducer";
import { ReducerContext } from "../reducers/ReducerContext";
import { AppState } from "../state/AppState";
import { Theme } from "../Theme";
import { CardGrid } from "./CardGrid";
import { PlayerViewTopBar } from "./PlayerViewTopBar";
import { restorePrunedEmptyArrays } from "./restorePrunedEmptyArrays";

function useStateFromSharedDashboard(dashboardId: string) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const dbRef = database().ref(`shared/${dashboardId}`);
    dbRef.once("value", (appState) => {
      const networkAppState: Partial<AppState> = appState.val();
      if (!networkAppState) {
        return;
      }
      const completeAppState = restorePrunedEmptyArrays(networkAppState);
      setState(completeAppState);
    });

    return () => dbRef.off();
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
          <PlayerViewTopBar />
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
      <Grommet style={{ minHeight: "100%" }} theme={Theme}>
        <Box fill align="center">
          <PlayerViewTopBar />
          <CardGrid />
        </Box>
      </Grommet>
    </ReducerContext.Provider>
  );
}
