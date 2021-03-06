import {
  faFolder,
  faFolderOpen,
  faSort
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fuse from "fuse.js";
import { Box, Button, Heading, TextInput } from "grommet";
import React, { useContext, useMemo, useState } from "react";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardState } from "../state/CardState";
import { CardTypeFriendlyNames } from "../state/CardTypeFriendlyNames";
import { CardLibraryRow } from "./CardLibraryRow";

type Grouping = {
  Name: string;
  GetGroupForCard: (cardState: CardState) => string;
  GetSection: React.FunctionComponent<{
    groupName: string;
    cards: CardState[];
  }>;
};

export const Groupings: Grouping[] = [
  {
    Name: "Type",
    GetGroupForCard: (cardState: CardState) =>
      CardTypeFriendlyNames[cardState.type],
    GetSection: (props: { groupName: string; cards: CardState[] }) => {
      return (
        <Box flex={false} key={props.groupName}>
          <Heading level={3} margin="xsmall">
            {props.groupName}
          </Heading>
          {props.cards.map((card) => (
            <CardLibraryRow key={card.cardId} card={card} />
          ))}
        </Box>
      );
    },
  },
  {
    Name: "Folder",
    GetGroupForCard: (cardState: CardState) => cardState.path ?? "",
    GetSection: (props: { groupName: string; cards: CardState[] }) => {
      const [folderOpen, setFolderOpen] = useState(false);

      if (props.groupName === "") {
        return (
          <Box flex={false} key={props.groupName}>
            {props.cards.map((card) => (
              <CardLibraryRow key={card.cardId} card={card} />
            ))}
          </Box>
        );
      }

      if (!folderOpen) {
        return (
          <Box flex={false} key={props.groupName}>
            <Button
              icon={<FontAwesomeIcon icon={faFolder} />}
              label={props.groupName}
              onClick={() => setFolderOpen(true)}
            />
          </Box>
        );
      } else {
        return (
          <Box flex={false} key={props.groupName}>
            <Button
              icon={<FontAwesomeIcon icon={faFolderOpen} />}
              label={props.groupName}
              onClick={() => setFolderOpen(false)}
            />
            {props.cards.map((card) => (
              <CardLibraryRow key={card.cardId} card={card} />
            ))}
          </Box>
        );
      }
    },
  },
];

export function CardLibrary() {
  const { state } = useContext(ReducerContext);
  const [groupingIndex, setGroupingIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const cards = Object.values(state.cardsById);
  const fuse = useMemo(() => new Fuse(cards, { keys: ["title"] }), [cards]);

  if (searchTerm.length > 0) {
    const searchResults = fuse.search(searchTerm);
    return (
      <Box pad="xsmall" overflow={{ vertical: "auto" }}>
        <TextInput
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.map((searchResult) => {
          const cardState = searchResult.item;
          return <CardLibraryRow key={cardState.cardId} card={cardState} />;
        })}
      </Box>
    );
  }

  const selectedGrouping = Groupings[groupingIndex];

  const cardsByGroup = Object.values(state.cardsById).reduce(
    (hash: Record<string, CardState[]>, cardState) => {
      const cardGroup = selectedGrouping.GetGroupForCard(cardState);
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
    .map((cardGroup) =>
      React.createElement(selectedGrouping.GetSection, {
        groupName: cardGroup,
        cards: cardsByGroup[cardGroup],
        key: cardGroup,
      })
    );

  return (
    <Box pad="xsmall" overflow={{ vertical: "auto" }}>
      <TextInput
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        label={"Sorted by " + selectedGrouping.Name}
        icon={<FontAwesomeIcon icon={faSort} />}
        onClick={() => {
          const nextGrouping = (groupingIndex + 1) % Groupings.length;
          setGroupingIndex(nextGrouping);
        }}
      />
      {headersAndCards}
    </Box>
  );
}
