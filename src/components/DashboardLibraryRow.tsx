import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";
import { DashboardState } from "../state/AppState";
import { LongPressButton } from "./LongPressButton";

export function DashboardLibraryRow(props: {
  dashboardId: string;
  dashboard: DashboardState;
}) {
  const { state, dispatch } = useContext(ReducerContext);

  const isActiveDashboard = state.activeDashboardId === props.dashboardId;

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
      <Button
        onClick={openDashboard}
        fill="horizontal"
        style={{ fontWeight: isActiveDashboard ? "bold" : undefined }}
      >
        {props.dashboard.name}
      </Button>
      <LongPressButton
        onLongPress={deleteDashboard}
        icon={<FontAwesomeIcon icon={faTrash} />}
      />
    </Box>
  );
}
