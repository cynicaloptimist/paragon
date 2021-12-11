import { Box, Header, Heading } from "grommet";
import React, { useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardLibrary } from "./CardLibrary";
import { DashboardLibrary } from "./DashboardLibrary";
import { LibrarySidebarControls } from "./LibrarySidebarControls";
import { Login } from "./LoginButton";

export function LibrarySidebar() {
  const { state } = useContext(ReducerContext);

  return (
    <Box
      background="background"
      elevation="large"
      style={{ position: "fixed", left: 0, width: "300px", height: "100%" }}
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
        <Login />
      </Box>
    </Box>
  );
}
