import {
  Box,
  BoxProps,
  Text,
  Button,
  Header,
  Heading,
  Tip,
  ResponsiveContext,
} from "grommet";
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
import { DashboardState } from "../../state/DashboardState";

export const TopBar = () => {
  const { state } = useContext(ReducerContext);
  const size = useContext(ResponsiveContext);
  const dashboardId = useActiveDashboardId();

  const dashboard = GetDashboard(state, dashboardId);
  const isMobile = size === "small" || size === "xsmall";

  const headerProps: BoxProps = {
    background: "brand",
    pad: "small",
    direction: "column",
    gap: "none",
    fill: "horizontal",
    align: "stretch",
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
      <Box direction="row" justify="between">
        <LibrarySidebarControls />
        {!isMobile && <DashboardTitle subheader={subheader} />}
        <Box direction="row" gap="small">
          <NewCardMenu />
          <RollAllTablesButton />
          <DashboardMenu dashboard={dashboard} />
        </Box>
      </Box>
      {isMobile && <DashboardTitle subheader={subheader} />}
    </Header>
  );
};

function DashboardTitle({ subheader }: { subheader: string }) {
  return (
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
  );
}

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
