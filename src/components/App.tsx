import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "../App.css";

import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import { GameMasterView } from "./GameMasterView";
import { PlayerView } from "./PlayerView";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/p/:playerViewId">
          <PlayerView />
        </Route>
        <Route path="/">
          <GameMasterView />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
