import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions } from "../actions/Actions";
import { randomString } from "../randomString";
import { ReducerContext } from "../reducers/ReducerContext";
import { DashboardState } from "../state/AppState";
import { LongPressButton } from "./LongPressButton";

export function DashboardLibrary() {
  const { state, dispatch } = useContext(ReducerContext);
  return (
    <Box pad="xsmall" overflow={{ vertical: "auto" }}>
      {Object.keys(state.dashboardsById).map((dashboardId) => {
        const dashboard = state.dashboardsById[dashboardId];
        return (
          <DashboardLibraryRow dashboardId={dashboardId} dashboard={dashboard} />
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

export function DashboardLibraryRow(props: {
  dashboardId: string;
  dashboard: DashboardState;
}) {
  const { dispatch } = useContext(ReducerContext);

  const openDashboard = useCallback(
    () =>
      dispatch(Actions.ActivateDashboard({ dashboardId: props.dashboardId })),
    [dispatch, props.dashboardId]
  );

  const deleteDashboard = useCallback(() => {
    dispatch(Actions.DeleteDashboard({ dashboardId: props.dashboardId }));
  }, [dispatch, props.dashboardId]);

  return (
    <Box flex={false} direction="row">
      <Button onClick={openDashboard} fill="horizontal">
        {props.dashboard.name}
      </Button>
      <LongPressButton
        onLongPress={deleteDashboard}
        icon={<FontAwesomeIcon icon={faTrash} />}
      />
    </Box>
  );
}
