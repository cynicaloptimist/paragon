import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "grommet";
import { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { Actions } from "../../actions/Actions";
import { DashboardActions } from "../../actions/DashboardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardState } from "../../state/AppState";
import { LongPressButton } from "../common/LongPressButton";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";

export function DashboardLibraryRow(props: {
  dashboardId: string;
  dashboard: DashboardState;
}) {
  const { dispatch } = useContext(ReducerContext);
  const activeDashboardId = useActiveDashboardId();

  const isActiveDashboard = activeDashboardId === props.dashboardId;

  const deleteDashboard = useCallback(() => {
    dispatch(
      DashboardActions.DeleteDashboard({ dashboardId: props.dashboardId })
    );
  }, [dispatch, props.dashboardId]);

  return (
    <Box
      flex={false}
      direction="row"
      background={{
        color: isActiveDashboard ? "brand-2" : "transparent",
      }}
    >
      <Box
        fill="horizontal"
        justify="center"
        margin="xsmall"
        style={{ overflowX: "hidden" }}
      >
        <Link
          to={`/e/${props.dashboardId}`}
          onClick={() =>
            dispatch(Actions.SetLibraryMode({ libraryMode: "hidden" }))
          }
        >
          {props.dashboard.name}
        </Link>
      </Box>
      <LongPressButton
        tip="Delete Dashboard"
        onLongPress={deleteDashboard}
        icon={<FontAwesomeIcon icon={faTrash} />}
      />
    </Box>
  );
}
