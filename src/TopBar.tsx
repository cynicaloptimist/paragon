import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Header, Button, Text } from "grommet";

export const TopBar = () => (
  <Header background="brand" pad="small">
    <Button icon={<FontAwesomeIcon size="sm" icon={faBars} />} />
    <Text>Paragon Campaign Dashboard</Text>
    <Button>Help</Button>
  </Header>
);
