import { Box, Button } from "grommet";
import React, { useCallback, useContext } from "react";
import { ReactComponent as CardStack } from "../../cards-regular.svg";
import { ReactComponent as DMScreen } from "../../dm-screen-regular.svg";
import { UIContext } from "../UIContext";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReducerContext } from "../../reducers/ReducerContext";

export function LibrarySidebarControls() {
  const { librarySidebarMode, setLibrarySidebarMode } = useContext(UIContext);
  const { state } = useContext(ReducerContext);

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

  const toggleCampaignLibrary = useCallback(() => {
    if (librarySidebarMode === "campaigns") {
      setLibrarySidebarMode("hidden");
    } else {
      setLibrarySidebarMode("campaigns");
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
      <Button
        tip="Campaigns"
        icon={<FontAwesomeIcon icon={faGlobe} />}
        onClick={toggleCampaignLibrary}
      />
    </Box>
  );
}
