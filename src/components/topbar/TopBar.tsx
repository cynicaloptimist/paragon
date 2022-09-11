import { Box, BoxProps, Header, Heading } from "grommet";
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

export const TopBar = () => {
  const { state } = useContext(ReducerContext);

  const dashboard = GetDashboard(state);
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
  const dashboardId = useActiveDashboardId();
  const dashboardName = GetDashboard(state)?.name || "";
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
