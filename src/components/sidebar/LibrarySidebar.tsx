import { Box, Header, Heading, Layer } from "grommet";
import React, { useCallback, useContext } from "react";
import { CardLibrary } from "./CardLibrary";
import { DashboardLibrary } from "./DashboardLibrary";
import { LibrarySidebarContext } from "./LibrarySidebarContext";
import { LibrarySidebarControls } from "./LibrarySidebarControls";
import { LoginLogout } from "./LoginLogout";

export function LibrarySidebar() {
  const { librarySidebarMode, setLibrarySidebarMode } = useContext(
    LibrarySidebarContext
  );
  const closeSidebar = useCallback(() => {
    setLibrarySidebarMode("hidden");
  }, [setLibrarySidebarMode]);

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
            {librarySidebarMode === "dashboards" ? "Dashboards" : "Cards"}
          </Heading>
        </Header>
        <Box fill>
          {librarySidebarMode === "dashboards" ? (
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
