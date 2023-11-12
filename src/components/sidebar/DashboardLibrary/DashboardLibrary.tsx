import { faGlobe, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Text, Tip } from "grommet";
import _ from "lodash";
import { useContext } from "react";
import { DashboardActions } from "../../../actions/DashboardActions";
import { randomString } from "../../../randomString";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { DashboardLibraryRow } from "./DashboardLibraryRow";

export function DashboardLibrary() {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardPairs = _.toPairs(state.dashboardsById);
  const dashboardPairsSorted = _.sortBy(
    dashboardPairs,
    ([, dashboard]) => -(dashboard.lastOpenedTimeMs ?? 0)
  ).filter(([, dashboard]) => {
    if (!state.activeCampaignId) {
      return true;
    }
    if (!dashboard.campaignId) {
      return true;
    }
    if (!state.campaignsById[dashboard.campaignId]) {
      return true;
    }
    return dashboard.campaignId === state.activeCampaignId;
  });

  return (
    <Box pad="xsmall" overflow={{ vertical: "auto" }}>
      <CampaignHeader />
      {dashboardPairsSorted.map(([dashboardId, dashboard]) => {
        return (
          <DashboardLibraryRow
            key={dashboardId}
            dashboardId={dashboardId}
            dashboard={dashboard}
          />
        );
      })}
      <Button
        onClick={() =>
          dispatch(
            DashboardActions.CreateDashboard({ dashboardId: randomString() })
          )
        }
        fill="horizontal"
        label="New Dashboard"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    </Box>
  );
}

function CampaignHeader() {
  const { state } = useContext(ReducerContext);
  if (state.activeCampaignId) {
    return (
      <Text>
        <Tip content="Dashboards shown for Active Campaign">
          <Button icon={<FontAwesomeIcon icon={faGlobe} />} />
        </Tip>
        {state.campaignsById[state.activeCampaignId]?.title}
      </Text>
    );
  } else {
    return null;
  }
}
