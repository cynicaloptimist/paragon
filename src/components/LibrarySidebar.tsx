import { Box, Button, Header, Heading } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions } from "../actions/Actions";
import cardStack from "../cards-regular.svg";
import dashboardIcon from "../dm-screen-regular.svg";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardLibrary } from "./CardLibrary";
import { DashboardLibrary } from "./DashboardLibrary";

export function LibrarySidebar() {
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
    <Box
      background="background"
      elevation="large"
      style={{ position: "fixed", left: 0, width: "300px", height: "100%" }}
    >
      <Header background="brand" pad="small">
        <Box direction="row">
          <Button
            margin="2px"
            icon={<img src={cardStack} alt="Cards" height="22px" />}
            onClick={toggleCardLibrary}
          />
          <Button
            margin="2px"
            icon={<img src={dashboardIcon} alt="Dashboards" height="22px" />}
            onClick={toggleDashboardLibrary}
          />
        </Box>
        <Heading level={3} margin="none">
          {state.librarySidebarMode === "dashboards" ? "Dashboards" : "Cards"}
        </Heading>
      </Header>
      {state.librarySidebarMode === "dashboards" ? (
        <DashboardLibrary />
      ) : (
        <CardLibrary />
      )}
    </Box>
  );
}
