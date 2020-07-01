import React, { useContext, useCallback } from "react";
import { ReducerContext } from "./ReducerContext";
import { Box, Text, Header, Button } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import values from "lodash/values";
import { Actions } from "./Actions";

export function CardLibrary() {
  const { state, dispatch } = useContext(ReducerContext);

  const hideCardLibrary = useCallback(
    () => dispatch(Actions.SetCardLibraryVisibility({ visibility: false })),
    [dispatch]
  );
  const openCard = useCallback(
    (cardId: string) => dispatch(Actions.OpenCard({ cardId })),
    [dispatch]
  );

  return (
    <Box
      background="background"
      elevation="large"
      style={{ position: "fixed", width: "300px", height: "100%" }}
    >
      <Header background="brand" pad="small">
        <Button
          icon={<FontAwesomeIcon size="sm" icon={faBars} />}
          onClick={hideCardLibrary}
        />
      </Header>
      <Box pad="xsmall">
        {values(state.cardsById).map((card) => (
          <Text key={card.cardId} onClick={() => openCard(card.cardId)}>
            {card.title}
          </Text>
        ))}
      </Box>
    </Box>
  );
}