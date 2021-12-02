import { Box, BoxProps, Header, Heading } from "grommet";
import React, { useContext } from "react";
import { Actions } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { ActiveDashboardOf } from "../../state/AppState";
import { DashboardMenu } from "./DashboardMenu";
import { EditableText } from "../common/EditableText";
import { LibrarySidebarControls } from "../sidebar/LibrarySidebarControls";
import { NewCardMenu } from "./NewCardMenu";
import { RollAllTablesButton } from "./RollAllTablesButton";

export const TopBar = () => {
  const { state } = useContext(ReducerContext);

  const dashboard = ActiveDashboardOf(state);
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
          Paragon Campaign Dashboard
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
