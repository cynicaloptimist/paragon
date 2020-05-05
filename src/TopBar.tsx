import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Header, Button, Text } from "grommet";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";

export const TopBar = () => {
  const { dispatch } = useContext(ReducerContext);
  return (
    <Header background="brand" pad="small">
      <Button icon={<FontAwesomeIcon size="sm" icon={faBars} />} />
      <Text>Paragon Campaign Dashboard</Text>
      <Button
        aria-label="add"
        onClick={() => dispatch(Actions.AddCard())}
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    </Header>
  );
};
