import { Box, Header, Heading, Layer } from "grommet";
import React, { useCallback, useContext } from "react";
import { CardLibrary } from "./CardLibrary/CardLibrary";
import { DashboardLibrary } from "./DashboardLibrary/DashboardLibrary";
import { UIContext } from "../UIContext";
import { LibrarySidebarControls } from "./LibrarySidebarControls";
import { LoginLogout } from "./LoginLogout";
import { CampaignLibrary } from "./CampaignLibrary/CampaignLibrary";

export function LibrarySidebar() {
  const { librarySidebarMode, setLibrarySidebarMode } = useContext(UIContext);
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
            {librarySidebarMode === "cards" && "Cards"}
            {librarySidebarMode === "dashboards" && "Dashboards"}
            {librarySidebarMode === "campaigns" && "Campaigns"}
          </Heading>
        </Header>
        <Box fill>
          {librarySidebarMode === "cards" && <CardLibrary />}
          {librarySidebarMode === "dashboards" && <DashboardLibrary />}
          {librarySidebarMode === "campaigns" && <CampaignLibrary />}
        </Box>
        <Box alignSelf="stretch">
          <LoginLogout />
        </Box>
      </Box>
    </Layer>
  );
}
