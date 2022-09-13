import { Box, Button } from "grommet";
import React, { useCallback, useContext } from "react";
import { ReactComponent as CardStack } from "../../cards-regular.svg";
import { ReactComponent as DMScreen } from "../../dm-screen-regular.svg";
import { UIContext } from "./UIContext";

export function LibrarySidebarControls() {
  const { librarySidebarMode, setLibrarySidebarMode } = useContext(UIContext);

  const toggleCardLibrary = useCallback(() => {
    if (librarySidebarMode === "cards") {
      setLibrarySidebarMode("hidden");
    } else {
      setLibrarySidebarMode("cards");
    }
  }, [librarySidebarMode, setLibrarySidebarMode]);

  const toggleDashboardLibrary = useCallback(() => {
    if (librarySidebarMode === "dashboards") {
      setLibrarySidebarMode("hidden");
    } else {
      setLibrarySidebarMode("dashboards");
    }
  }, [librarySidebarMode, setLibrarySidebarMode]);

  return (
    <Box direction="row" gap="small">
      <Button
        tip="Cards"
        icon={<CardStack title="Cards" height="22px" />}
        onClick={toggleCardLibrary}
      />
      <Button
        tip="Dashboards"
        icon={<DMScreen title="Dashboards" height="22px" />}
        onClick={toggleDashboardLibrary}
      />
    </Box>
  );
}
