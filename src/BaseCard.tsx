import React from "react";
import { Box, Header } from "grommet";

export function BaseCard(props: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box fill elevation="medium">
      <Box className="drag-handle">
        <Header pad="xsmall" background="brand">
          {props.header}
        </Header>
      </Box>
      <Box flex={{ grow: 1 }} pad="xxsmall">
        {props.children}
      </Box>
    </Box>
  );
}
