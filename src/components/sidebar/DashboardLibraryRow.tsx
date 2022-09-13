import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Anchor, Box } from "grommet";
import { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { DashboardActions } from "../../actions/DashboardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardState } from "../../state/AppState";
import { LongPressButton } from "../common/LongPressButton";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { LibrarySidebarContext } from "./LibrarySidebarContext";

export function DashboardLibraryRow(props: {
  dashboardId: string;
  dashboard: DashboardState;
}) {
  const { dispatch } = useContext(ReducerContext);
  const { setLibrarySidebarMode } = useContext(LibrarySidebarContext);
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
          onClick={() => setLibrarySidebarMode("hidden")}
          component={Anchor}
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
