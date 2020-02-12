import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const TopBar = () => (
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu">
        <FontAwesomeIcon icon={faBars} />
      </IconButton>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        Paragon Campaign Dashboard
      </Typography>
      <Button color="inherit">Help</Button>
    </Toolbar>
  </AppBar>
);
