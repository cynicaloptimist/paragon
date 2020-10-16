import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import React, { useContext } from "react";
import { Actions } from "../actions/Actions";
import { randomString } from "../randomString";
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
              onClick={() =>
                dispatch(Actions.ActivateDashboard({ dashboardId }))
              }
            >
              {dashboard.name}
            </Button>
          </Box>
        );
      })}
      <Button
        onClick={() =>
          dispatch(Actions.CreateDashboard({ dashboardId: randomString() }))
        }
        fill="horizontal"
        label="New Dashboard"
        icon={<FontAwesomeIcon size="sm" icon={faPlus} />}
      />
    </Box>
  );
}
