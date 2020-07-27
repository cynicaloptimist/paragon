import React, { useContext, useCallback } from "react";
import { ReducerContext } from "../reducers/ReducerContext";
import { Box, Header, Button, Heading } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Actions } from "../actions/Actions";
import { CardLibraryRow } from "./CardLibraryRow";
import { CardState } from "../state/CardState";

export function CardLibrary() {
  const { state, dispatch } = useContext(ReducerContext);

  const hideCardLibrary = useCallback(
    () => dispatch(Actions.SetCardLibraryVisibility({ visibility: false })),
    [dispatch]
  );

  const cardsByType = Object.values(state.cardsById).reduce(
    (hash: Record<string, CardState[]>, cardState) => {
      if (hash[cardState.type] === undefined) {
        hash[cardState.type] = [];
      }

      hash[cardState.type].push(cardState);

      return hash;
    },
    {}
  );

  const headersAndCards = Object.keys(cardsByType).map((cardType) => {
    return (
      <Box flex={false}>
        <Heading level={3} margin="xsmall">{cardType}</Heading>
        {cardsByType[cardType].map((card) => (
          <CardLibraryRow key={card.cardId} card={card} />
        ))}
      </Box>
    );
  });

  return (
    <Box
      background="background"
      elevation="large"
      style={{ position: "fixed", left: 0, width: "300px", height: "100%" }}
    >
      <Header background="brand" pad="small">
        <Button
          icon={<FontAwesomeIcon size="sm" icon={faBars} />}
          onClick={hideCardLibrary}
        />
      </Header>
      <Box pad="xsmall" overflow={{ vertical: "auto" }}>
        {headersAndCards}
      </Box>
    </Box>
  );
}
