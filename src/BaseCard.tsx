import React from "react";
import { Paper, AppBar, Toolbar, CardContent } from "@material-ui/core";

export function BaseCard(props: {
  header: React.ReactElement;
  children?: React.ReactElement;
}) {
  return (
    <Paper style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <AppBar position="relative" className="drag-handle">
        <Toolbar variant="dense">{props.header}</Toolbar>
      </AppBar>
      <CardContent style={{ height: "100%" }}>{props.children}</CardContent>
    </Paper>
  );
}
