import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./App.css";

import React from "react";

import { TopBar } from "./TopBar";
import { AppReducer } from "./AppReducer";
import { GetInitialState } from "./AppState";
import { ReducerContext } from "./ReducerContext";
import { Grommet, Box } from "grommet";
import { useStorageBackedReducer } from "./useStorageBackedReducer";
import { CardGrid } from "./CardGrid";

const App = () => {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    GetInitialState(),
    "appState"
  );

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <Grommet style={{ height: "100%" }}>
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
