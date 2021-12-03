import { getDatabase, off, onValue, push, ref } from "firebase/database";
import "firebase/database";
import { Box, Grommet } from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RootAction } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState, EmptyState } from "../../state/AppState";
import { Theme } from "../../Theme";
import { CardGrid } from "./CardGrid";
import { PlayerViewTopBar } from "../topbar/PlayerViewTopBar";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";
import { FirebaseUtils } from "../../FirebaseUtils"
import { app } from "../..";

function useRemoteState(
  playerViewId: string
): [AppState, React.Dispatch<RootAction>] {
  const [state, setState] = useState(EmptyState());
  const [playerViewUserId, setPlayerViewUserId] = useState<string | null>(null);

  useEffect(() => {
    const database = getDatabase(app);
    const idDbRef = ref(
      database,
      `playerViews/${playerViewId.toLocaleLowerCase()}`
    );

    onValue(idDbRef, (id) => {
      setPlayerViewUserId(id.val());
    });

    return () => off(idDbRef);
  }, [playerViewId]);

  useEffect(() => {
    if (!playerViewUserId) {
      return;
    }
    const database = getDatabase(app);
    const dbRef = ref(
      database,
      `users/${playerViewUserId}/playerViews/${playerViewId}`
    );
    onValue(dbRef, (appState) => {
      const networkAppState: Partial<AppState> = appState.val();
      if (!networkAppState) {
        return;
      }
      const completeAppState = FirebaseUtils.restorePrunedEmptyArrays(networkAppState);
      setState(completeAppState);
    });

    return () => off(dbRef);
  }, [playerViewId, playerViewUserId]);

  const dispatch = (action: RootAction) => {
    const cleanAction = FirebaseUtils.removeUndefinedNodesFromTree(action);
    const database = getDatabase(app);
    const dbRef = ref(database, `pendingActions/${state.activeDashboardId}`);
    push(dbRef, cleanAction);
  };

  return [state, dispatch];
}

export function PlayerView() {
  const { playerViewId } = useParams<{ playerViewId: string }>();
  const [state, dispatch] = useRemoteState(playerViewId);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <ViewTypeContext.Provider value={ViewType.Player}>
        <Grommet style={{ minHeight: "100%" }} theme={Theme}>
          <Box fill align="center">
            <PlayerViewTopBar />
            <CardGrid />
          </Box>
        </Grommet>
      </ViewTypeContext.Provider>
    </ReducerContext.Provider>
  );
}
