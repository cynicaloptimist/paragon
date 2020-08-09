import React, { useContext, useCallback, useState } from "react";
import { ReducerContext } from "../reducers/ReducerContext";
import { Box, Header, Button, Heading } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSort } from "@fortawesome/free-solid-svg-icons";
import { Actions } from "../actions/Actions";
import { CardLibraryRow } from "./CardLibraryRow";
import { CardState } from "../state/CardState";
import { CardTypeFriendlyNames } from "../state/CardTypeFriendlyNames";

enum Grouping {
  ByType,
  ByFolder,
}

const GroupingFunctions: Record<Grouping, (cardState: CardState) => string> = {
  [Grouping.ByType]: (cardState: CardState) =>
    CardTypeFriendlyNames[cardState.type],
  [Grouping.ByFolder]: (cardState: CardState) => cardState.path ?? "",
};

export function CardLibrary() {
  const { state, dispatch } = useContext(ReducerContext);
  const [grouping, setGrouping] = useState(Grouping.ByType);

  const hideCardLibrary = useCallback(
    () => dispatch(Actions.SetCardLibraryVisibility({ visibility: false })),
    [dispatch]
  );

  const cardsByGroup = Object.values(state.cardsById).reduce(
    (hash: Record<string, CardState[]>, cardState) => {
      const cardGroup = GroupingFunctions[grouping](cardState);
      if (hash[cardGroup] === undefined) {
        hash[cardGroup] = [];
      }

      hash[cardGroup].push(cardState);

      return hash;
    },
    {}
  );

  const headersAndCards = Object.keys(cardsByGroup)
    .sort()
    .map((cardGroup) => {
      return (
        <Box flex={false} key={cardGroup}>
          <Heading level={3} margin="xsmall">
            {cardGroup}
          </Heading>
          {cardsByGroup[cardGroup].map((card) => (
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
        <Button
          icon={<FontAwesomeIcon size="sm" icon={faSort} />}
          onClick={() => {
            const nextGrouping =
              (grouping + 1) % (Object.keys(Grouping).length / 2);
            setGrouping(nextGrouping);
          }}
        />
      </Header>
      <Box pad="xsmall" overflow={{ vertical: "auto" }}>
        {headersAndCards}
      </Box>
    </Box>
  );
}
