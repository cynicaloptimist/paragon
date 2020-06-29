import React, { useContext } from "react";
import { ReducerContext } from "./ReducerContext";
import { Box, Text, Header, Button } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import values from "lodash/values";

export function CardLibrary() {
  const { state } = useContext(ReducerContext);
  return (
    <Box
      background="background"
      elevation="large"
      style={{ position: "fixed", width: "300px", height: "100%" }}
    >
      <Header background="brand" pad="small">
        <Button icon={<FontAwesomeIcon size="sm" icon={faBars} />} />
      </Header>
      <Box pad="xsmall">
        {values(state.cardsById).map((card) => (
          <Text key={card.cardId}>{card.title}</Text>
        ))}
      </Box>
    </Box>
  );
}
