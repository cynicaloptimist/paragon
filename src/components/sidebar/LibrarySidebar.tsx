import { Box, Header, Heading, Layer } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardLibrary } from "./CardLibrary";
import { DashboardLibrary } from "./DashboardLibrary";
import { LibrarySidebarControls } from "./LibrarySidebarControls";
import { LoginLogout } from "./LoginLogout";

export function LibrarySidebar() {
  const { state, dispatch } = useContext(ReducerContext);
  const closeSidebar = useCallback(() => {
    dispatch(Actions.SetLibraryMode({ libraryMode: "hidden" }));
  }, [dispatch]);

  return (
    <Layer
      onClickOutside={closeSidebar}
      onEsc={closeSidebar}
      position="left"
      full="vertical"
    >
      <Box
        background="background"
        style={{ width: "300px", minHeight: "100%" }}
        alignContent="center"
      >
        <Header background="brand" pad="small" height="xsmall">
          <LibrarySidebarControls />
          <Heading level={3} margin="none">
            {state.librarySidebarMode === "dashboards" ? "Dashboards" : "Cards"}
          </Heading>
        </Header>
        <Box fill>
          {state.librarySidebarMode === "dashboards" ? (
            <DashboardLibrary />
          ) : (
            <CardLibrary />
          )}
        </Box>
        <Box alignSelf="stretch">
          <LoginLogout />
        </Box>
      </Box>
    </Layer>
  );
}
