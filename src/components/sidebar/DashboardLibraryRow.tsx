import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Anchor, Box, Button } from "grommet";
import { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { DashboardActions } from "../../actions/DashboardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardState } from "../../state/DashboardState";
import { LongPressButton } from "../common/LongPressButton";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { AddToCampaignIcon } from "./AddToCampaignIcon";

export function DashboardLibraryRow(props: {
  dashboardId: string;
  dashboard: DashboardState;
}) {
  const { state, dispatch } = useContext(ReducerContext);
  const activeDashboardId = useActiveDashboardId();

  const isActiveDashboard = activeDashboardId === props.dashboardId;

  const showActiveCampaignButton =
    state.activeCampaignId && !props.dashboard.campaignId;

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
        <Link to={`/e/${props.dashboardId}`} component={Anchor}>
          {props.dashboard.name}
        </Link>
      </Box>
      {showActiveCampaignButton && (
        <Button
          style={{ padding: "6px" }}
          tip="Move to Active Campaign"
          onClick={() =>
            dispatch(
              DashboardActions.SetDashboardCampaign({
                dashboardId: props.dashboardId,
                campaignId: state.activeCampaignId,
              })
            )
          }
          icon={<AddToCampaignIcon />}
        />
      )}
      <LongPressButton
        tip="Delete Dashboard"
        onLongPress={deleteDashboard}
        icon={<FontAwesomeIcon icon={faTrash} />}
      />
    </Box>
  );
}
