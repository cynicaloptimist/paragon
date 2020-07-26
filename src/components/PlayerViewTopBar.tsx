import React from "react";
import { Header, Heading } from "grommet";

export const PlayerViewTopBar = () => {
  return (
    <Header fill="horizontal" background="brand" pad="small" justify="center">
      <Heading level={1} size="small" margin="xxsmall">
        Paragon Campaign Dashboard: Player View
      </Heading>
    </Header>
  );
};
