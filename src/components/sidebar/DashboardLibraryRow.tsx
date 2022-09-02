import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "grommet";
import { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { Actions } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardState } from "../../state/AppState";
import { LongPressButton } from "../common/LongPressButton";

export function DashboardLibraryRow(props: {
  dashboardId: string;
  dashboard: DashboardState;
}) {
  const { state, dispatch } = useContext(ReducerContext);

  const isActiveDashboard = state.activeDashboardId === props.dashboardId;

  const deleteDashboard = useCallback(() => {
    dispatch(Actions.DeleteDashboard({ dashboardId: props.dashboardId }));
  }, [dispatch, props.dashboardId]);

  return (
    <Box
      flex={false}
      direction="row"
      background={{
        color: isActiveDashboard ? "brand-2" : "transparent",
      }}
    >
      <Link
        to={`/e/${props.dashboardId}`}
        onClick={() =>
          dispatch(Actions.SetLibraryMode({ libraryMode: "hidden" }))
        }
      >
        <Box fill="horizontal" margin="xsmall" style={{ overflowX: "hidden" }}>
          {props.dashboard.name}
        </Box>
      </Link>
      <LongPressButton
        tip="Delete Dashboard"
        onLongPress={deleteDashboard}
        icon={<FontAwesomeIcon icon={faTrash} />}
      />
    </Box>
  );
}
