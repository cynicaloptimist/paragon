import { faColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Header, Heading } from "grommet";
import React, { useCallback, useContext, useState } from "react";
import { Actions } from "../actions/Actions";
import cardStack from "../cards-regular.svg";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardLibrary } from "./CardLibrary";
import { DashboardLibrary } from "./DashboardLibrary";

export function LibrarySidebar() {
  const { dispatch } = useContext(ReducerContext);
  const hideLibrary = useCallback(
    () => dispatch(Actions.SetLibraryMode({ libraryMode: "hidden" })),
    [dispatch]
  );
  const [libraryMode, setLibraryMode] = useState<"dashboards" | "cards">(
    "cards"
  );

  const toggleLibraryMode = useCallback(() => {
    if (libraryMode === "dashboards") {
      setLibraryMode("cards");
    } else {
      setLibraryMode("dashboards");
    }
  }, [libraryMode, setLibraryMode]);

  return (
    <Box
      background="background"
      elevation="large"
      style={{ position: "fixed", left: 0, width: "300px", height: "100%" }}
    >
      <Header background="brand" pad="small">
        <Button
          icon={<img src={cardStack} alt="Cards" height="22px" />}
          onClick={hideLibrary}
        />
        <Heading level={3} margin="none">
          {libraryMode === "dashboards" ? "Dashboards" : "Cards"}
        </Heading>
        <Button
          icon={<FontAwesomeIcon size="sm" icon={faColumns} />}
          onClick={toggleLibraryMode}
        />
      </Header>
      {libraryMode === "dashboards" ? <DashboardLibrary /> : <CardLibrary />}
    </Box>
  );
}
