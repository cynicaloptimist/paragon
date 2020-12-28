import {
  faEllipsisV,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CheckBox, Header, Heading, Menu, Text } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";
import { ActiveDashboardOf } from "../state/AppState";
import { EditableText } from "./EditableText";
import { LibrarySidebarControls } from "./LibrarySidebarControls";
import { NewCardMenu } from "./NewCardMenu";
import { RollAllTablesButton } from "./RollAllTablesButton";

export const TopBar = () => {
  const { state, dispatch } = useContext(ReducerContext);

  const setLayoutCompaction = useCallback(
    (compaction: "free" | "compact") =>
      dispatch(Actions.SetLayoutCompaction({ layoutCompaction: compaction })),
    [dispatch]
  );

  if (state.activeDashboardId == null) {
    return (
      <Header background="brand" pad="small" fill="horizontal">
        <LibrarySidebarControls />
        <Box fill="horizontal" direction="row" justify="center">
          <Heading level={1} size="small" margin="xxsmall">
            Paragon Campaign Dashboard
          </Heading>
        </Box>
      </Header>
    );
  }

  const dashboard = state.dashboardsById[state.activeDashboardId];

  return (
    <Header background="brand" pad="small" fill="horizontal">
      <LibrarySidebarControls />
      <Box fill="horizontal" direction="column" justify="center" align="center">
        <Heading level={1} size="small" margin="none">
          <DashboardNameWithEdit />
        </Heading>
        <Heading level={2} size="small" margin="none">
          Paragon Campaign Dashboard
        </Heading>
      </Box>
      <Box direction="row" flex="grow">
        <NewCardMenu />
        <RollAllTablesButton />
        <Menu
          dropAlign={{ right: "right", top: "bottom" }}
          icon={<FontAwesomeIcon icon={faEllipsisV} />}
          items={[
            dashboard.layoutCompaction === "free"
              ? {
                  label: <CheckBox label="Compact Card Layout" />,
                  onClick: () => setLayoutCompaction("compact"),
                }
              : {
                  label: <CheckBox label="Compact Card Layout" checked />,
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
              onClick: () =>
                window.open(`/p/${state.activeDashboardId}`, "_blank"),
            },
          ]}
        />
      </Box>
    </Header>
  );
};

function DashboardNameWithEdit() {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardName = ActiveDashboardOf(state)?.name || "";
  return (
    <EditableText
      text={dashboardName}
      trySubmit={(newName) => {
        if (newName.length > 0) {
          dispatch(Actions.RenameActiveDashboard({ newName }));
          return true;
        }
        return false;
      }}
    />
  );
}
