import {
  faEllipsisV,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckBox, Menu, Text } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";
import { DashboardState } from "../state/AppState";
import { ShareDashboard } from "./ShareDashboard";

export function DashboardMenu(props: { dashboard: DashboardState }) {
  const { state, dispatch } = useContext(ReducerContext);

  const setLayoutCompaction = useCallback(
    (compaction: "free" | "compact") =>
      dispatch(Actions.SetLayoutCompaction({ layoutCompaction: compaction })),
    [dispatch]
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
