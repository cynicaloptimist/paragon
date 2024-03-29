import {
  faEllipsisV,
  faExternalLinkAlt,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckBox, Menu, Text } from "grommet";
import { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { DashboardActions } from "../../actions/DashboardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardState } from "../../state/DashboardState";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { UIContext } from "../UIContext";
import { ShareDashboard } from "./ShareDashboard";
import { CampaignChooser } from "../common/CampaignChooser";

export function DashboardMenu(props: { dashboard: DashboardState }) {
  const { state, dispatch } = useContext(ReducerContext);
  const { setAppSettingsVisible } = useContext(UIContext);
  const dashboardId = useActiveDashboardId();
  const dashboardState = dashboardId && state.dashboardsById[dashboardId];
  const [campaignChooserActive, setCampaignChooserActive] = useState(false);

  const setLayoutCompaction = useCallback(
    (compaction: "free" | "compact") =>
      dashboardId &&
      dispatch(
        DashboardActions.SetLayoutCompaction({
          dashboardId,
          layoutCompaction: compaction,
        })
      ),
    [dispatch, dashboardId]
  );

  const setLayoutPushCards = useCallback(
    (pushCards: "none" | "preventcollision") =>
      dashboardId &&
      dispatch(
        DashboardActions.SetLayoutPushCards({
          dashboardId,
          layoutPushCards: pushCards,
        })
      ),
    [dispatch, dashboardId]
  );

  if (campaignChooserActive && dashboardState) {
    return (
      <CampaignChooser
        headerText="Move Dashboard to Campaign"
        close={() => setCampaignChooserActive(false)}
        activeCampaignId={dashboardState.campaignId}
        selectCampaign={(campaignId) =>
          // TODO: Add an option to also set card campaigns.
          dispatch(
            DashboardActions.SetDashboardCampaign({
              dashboardId,
              campaignId,
            })
          )
        }
      />
    );
  }

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faEllipsisV} />}
      items={[
        [
          {
            label: "Dashboard Menu",
            justify: "center",
            style: { fontStyle: "italic", cursor: "default" },
            hoverIndicator: false,
          },
        ],
        [
          props.dashboard.layoutCompaction === "free"
            ? {
                label: <CheckBox label="Auto-Compact Cards" />,
                onClick: () => setLayoutCompaction("compact"),
              }
            : {
                label: <CheckBox label="Auto-Compact Cards" checked />,
                onClick: () => setLayoutCompaction("free"),
              },
          props.dashboard.layoutPushCards === "preventcollision"
            ? {
                label: <CheckBox label="Push Cards" />,
                onClick: () => setLayoutPushCards("none"),
              }
            : {
                label: <CheckBox label="Push Cards" checked />,
                onClick: () => setLayoutPushCards("preventcollision"),
              },
          {
            label: "Change Campaign...",
            onClick: () => setCampaignChooserActive(true),
            disabled: !dashboardState,
            style: { display: state.user.hasEpic ? "unset" : "none" },
          },
          {
            label: (
              <Text>
                <MenuIcon icon={faExternalLinkAlt} />
                {"Player View: " + dashboardId}
              </Text>
            ),
            onClick: () => window.open(`/p/${dashboardId}`, "_blank"),
          },
          {
            label: (
              <Text>
                <MenuIcon icon={faExternalLinkAlt} />
                Share Dashboard
              </Text>
            ),
            onClick: async () => {
              if (dashboardId && (await ShareDashboard(state, dashboardId))) {
                window.open(`/d/${dashboardId}`, "_blank");
              }
            },
          },
        ],
        [
          {
            label: (
              <Text>
                <MenuIcon icon={faGears} />
                App Settings
              </Text>
            ),
            onClick: () => {
              setAppSettingsVisible(true);
            },
          },
        ],
      ]}
    />
  );
}

const MenuIcon = styled(FontAwesomeIcon).attrs({ fixedWidth: true })`
  padding: 0 5px 1px;
`;
