import React from "react";
import { Box, Header } from "grommet";

export function BaseCard(props: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box className="drag-handle">
        <Header background="brand">{props.header}</Header>
      </Box>
      {props.children}
    </Box>
  );
}
