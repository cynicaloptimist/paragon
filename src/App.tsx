import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./App.css";

import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import { TopBar } from "./TopBar";
import { AppReducer } from "./AppReducer";
import { GetInitialState } from "./AppState";
import { ReducerContext } from "./ReducerContext";
import { Grommet, Box } from "grommet";
import { useStorageBackedReducer } from "./useStorageBackedReducer";
import { CardGrid } from "./CardGrid";
import { Theme } from "./Theme";
import { useServerStateUpdates } from "./useServerStateUpdates";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <GameMasterView />
        </Route>
      </Switch>
    </Router>
  );
};

const GameMasterView = () => {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    GetInitialState(),
    "appState"
  );

  useServerStateUpdates(state);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <Grommet style={{ height: "100%" }} theme={Theme}>
        <Box fill align="center">
          <Box fill="vertical" width="1200px">
            <TopBar />
            <CardGrid />
          </Box>
        </Box>
      </Grommet>
    </ReducerContext.Provider>
  );
};

export default App;
