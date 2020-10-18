import { Box, Button } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions } from "../actions/Actions";
import cardStack from "../cards-regular.svg";
import dashboardIcon from "../dm-screen-regular.svg";
import { ReducerContext } from "../reducers/ReducerContext";


export function LibrarySidebarControls() {
  const { state, dispatch } = useContext(ReducerContext);

  const toggleCardLibrary = useCallback(() => {
    if (state.librarySidebarMode === "cards") {
      dispatch(Actions.SetLibraryMode({ libraryMode: "hidden" }));
    } else {
      dispatch(Actions.SetLibraryMode({ libraryMode: "cards" }));
    }
  }, [dispatch, state.librarySidebarMode]);

  const toggleDashboardLibrary = useCallback(() => {
    if (state.librarySidebarMode === "dashboards") {
      dispatch(Actions.SetLibraryMode({ libraryMode: "hidden" }));
    } else {
      dispatch(Actions.SetLibraryMode({ libraryMode: "dashboards" }));
    }
  }, [dispatch, state.librarySidebarMode]);

  return (
    <Box direction="row">
      <Button
        margin="2px"
        icon={<img src={cardStack} alt="Cards" height="22px" />}
        onClick={toggleCardLibrary} />
      <Button
        margin="2px"
        icon={<img src={dashboardIcon} alt="Dashboards" height="22px" />}
        onClick={toggleDashboardLibrary} />
    </Box>
  );
}
