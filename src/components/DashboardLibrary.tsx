import { Box, Button } from "grommet";
import React, { useContext } from "react";
import { Actions } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";

export function DashboardLibrary() {
  const { state, dispatch } = useContext(ReducerContext);
  return (
    <Box pad="xsmall" overflow={{ vertical: "auto" }}>
      {Object.keys(state.dashboardsById).map((dashboardId) => {
        const dashboard = state.dashboardsById[dashboardId];
        return (
          <Box flex={false} direction="row">
            <Button
              onClick={() => dispatch(Actions.ActivateDashboard({ dashboardId }))}
              fill="horizontal"
              label={dashboard.name} />
          </Box>
        );
      })}
    </Box>
  );
}
