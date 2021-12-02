import { Box, Button } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions } from "../../actions/Actions";
import { ReactComponent as CardStack } from "../../cards-regular.svg";
import { ReactComponent as DMScreen } from "../../dm-screen-regular.svg";
import { ReducerContext } from "../../reducers/ReducerContext";

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
    <Box direction="row" gap="small">
      <Button
        icon={<CardStack title="Cards" height="22px" />}
        onClick={toggleCardLibrary}
      />
      <Button
        icon={<DMScreen title="Dashboards" height="22px" />}
        onClick={toggleDashboardLibrary}
      />
    </Box>
  );
}
