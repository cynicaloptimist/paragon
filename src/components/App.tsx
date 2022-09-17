import React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../App.css";
import { SharedDashboardView } from "./views/SharedDashboardView";
import { GameMasterView } from "./views/GameMasterView";
import { PlayerView } from "./views/PlayerView";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/p/:dashboardId">
          <PlayerView />
        </Route>
        <Route path="/d/:dashboardId">
          <SharedDashboardView />
        </Route>
        <Route path="/e/:dashboardId">
          <GameMasterView />
        </Route>
        <Route path="/">
          <GameMasterView />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
