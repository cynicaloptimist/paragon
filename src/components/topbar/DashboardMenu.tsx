import {
  faEllipsisV,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckBox, Menu, Text } from "grommet";
import { useCallback, useContext } from "react";
import { DashboardActions } from "../../actions/DashboardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardState } from "../../state/AppState";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { ShareDashboard } from "./ShareDashboard";

export function DashboardMenu(props: { dashboard: DashboardState }) {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();

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

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faEllipsisV} />}
      items={[
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
          label: (
            <Text>
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                style={{ padding: "0 5px 1px" }}
              />
              {"Player View: " + state.activeDashboardId}
            </Text>
          ),
          onClick: () => window.open(`/p/${state.activeDashboardId}`, "_blank"),
        },
        {
          label: (
            <Text>
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                style={{ padding: "0 5px 1px" }}
              />
              Share Dashboard
            </Text>
          ),
          onClick: async () => {
            if (await ShareDashboard(state)) {
              window.open(`/d/${state.activeDashboardId}`, "_blank");
            }
          },
        },
      ]}
    />
  );
}
