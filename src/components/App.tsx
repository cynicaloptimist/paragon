import React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../App.css";

const PlayerView = React.lazy(() => import("./views/PlayerView"));
const SharedDashboardView = React.lazy(
  () => import("./views/SharedDashboardView")
);
const GameMasterView = React.lazy(() => import("./views/GameMasterView"));
const CampaignView = React.lazy(() => import("./views/CampaignView"));

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
        <Route path="/c/:campaignId">
          <CampaignView />
        </Route>
        <Route path="/">
          <GameMasterView />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
