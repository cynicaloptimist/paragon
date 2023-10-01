import { Box, BoxProps, Text, Button, Header, Heading, Tip } from "grommet";
import { useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { GetDashboard } from "../../state/AppState";
import { DashboardMenu } from "./DashboardMenu";
import { EditableText } from "../common/EditableText";
import { LibrarySidebarControls } from "../sidebar/LibrarySidebarControls";
import { NewCardMenu } from "./NewCardMenu";
import { RollAllTablesButton } from "./RollAllTablesButton";
import { DashboardActions } from "../../actions/DashboardActions";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

export const TopBar = () => {
  const { state } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();

  const dashboard = GetDashboard(state, dashboardId);
  const headerProps: BoxProps = {
    background: "brand",
    pad: "small",
    fill: "horizontal",
    height: "xsmall",
  };

  if (dashboard == null) {
    return (
      <Header {...headerProps}>
        <LibrarySidebarControls />
        <Box fill="horizontal" direction="row" justify="center">
          <Heading level={1} size="small" margin="xxsmall">
            Paragon Campaign Dashboard
          </Heading>
        </Box>
      </Header>
    );
  }

  let subheader = "Paragon Campaign Dashboard";
  if (dashboard.campaignId) {
    const campaign = state.campaignsById[dashboard.campaignId];
    if (campaign) {
      subheader = campaign.title;
    }
  }

  return (
    <Header {...headerProps}>
      <LibrarySidebarControls />
      <Box
        flex
        overflow="hidden"
        fill="horizontal"
        direction="column"
        justify="center"
        align="center"
      >
        <Heading level={1} size="small" margin="none">
          <DashboardNameWithEdit />
        </Heading>
        <Heading
          level={2}
          size="small"
          margin="none"
          style={{ whiteSpace: "nowrap" }}
        >
          {subheader}
          <CampaignMismatchWarning />
        </Heading>
      </Box>
      <Box direction="row" gap="small">
        <NewCardMenu />
        <RollAllTablesButton />
        <DashboardMenu dashboard={dashboard} />
      </Box>
    </Header>
  );
};

function CampaignMismatchWarning() {
  const { state } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  if (!dashboardId || !state.activeCampaignId) {
    return null;
  }
  const dashboard = state.dashboardsById[dashboardId];
  if (!dashboard || !dashboard.campaignId) {
    return null;
  }
  if (dashboard.campaignId === state.activeCampaignId) {
    return null;
  }
  const activeCampaign = state.campaignsById[state.activeCampaignId];
  if (!activeCampaign) {
    return null;
  }
  return (
    <Tip content={`Your active Campaign is ${activeCampaign.title}.`}>
      <Button margin={{ left: "small" }}>
        <FontAwesomeIcon icon={faWarning} />
      </Button>
    </Tip>
  );
}

function DashboardNameWithEdit() {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const dashboardName = GetDashboard(state, dashboardId)?.name || "";
  return (
    <EditableText
      text={dashboardName}
      trySubmit={(newName) => {
        if (dashboardId && newName.length > 0) {
          dispatch(
            DashboardActions.RenameActiveDashboard({
              dashboardId: dashboardId,
              newName,
            })
          );
          return true;
        }
        return false;
      }}
    />
  );
}
