import React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../App.css";
import { DashboardView } from "./DashboardView";
import { GameMasterView } from "./GameMasterView";
import { PlayerView } from "./PlayerView";



const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/p/:playerViewId">
          <PlayerView />
        </Route>
        <Route path="/d/:dashboardId">
          <DashboardView />
        </Route>
        <Route path="/">
          <GameMasterView />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
