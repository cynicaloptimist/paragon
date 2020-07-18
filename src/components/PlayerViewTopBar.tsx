import React from "react";
import { Header, Heading, Box } from "grommet";

export const PlayerViewTopBar = () => {
  return (
    <Header background="brand" pad="small">
      <Box fill="horizontal" direction="row" justify="center">
        <Heading level={1} size="small" margin="xxsmall">
          Paragon Campaign Dashboard: Player View
        </Heading>
      </Box>
    </Header>
  );
};
