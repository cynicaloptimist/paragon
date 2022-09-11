import { Box, Header, Heading } from "grommet";
import React, { useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { GetDashboard } from "../../state/AppState";
import { CopyDashboardButton } from "./CopyDashboardButton";
import { RollAllTablesButton } from "./RollAllTablesButton";

export const SharedDashboardViewTopBar = () => {
  const { state } = useContext(ReducerContext);
  return (
    <Header background="brand" pad="small" fill="horizontal">
      <Box fill="horizontal" direction="column" justify="center" align="center">
        <Heading level={1} size="small" margin="none">
          {GetDashboard(state)?.name || "Loading..."}
        </Heading>
        <Heading level={2} size="small" margin="none">
          Shared from Paragon Campaign Dashboard
        </Heading>
      </Box>
      <Box direction="row" flex="grow">
        <RollAllTablesButton />
        <CopyDashboardButton />
      </Box>
    </Header>
  );
};
