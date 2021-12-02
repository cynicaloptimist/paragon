import React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../App.css";
import { DashboardView } from "./views/DashboardView";
import { GameMasterView } from "./views/GameMasterView";
import { PlayerView } from "./views/PlayerView";

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
