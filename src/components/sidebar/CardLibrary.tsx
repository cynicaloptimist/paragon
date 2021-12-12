import {
  faFolder,
  faFolderOpen,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fuse from "fuse.js";
import { Box, Button, Heading, TextInput } from "grommet";
import React, { useContext, useMemo, useState } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState } from "../../state/AppState";
import { CardState } from "../../state/CardState";
import { CardTypeFriendlyNames } from "../../state/CardTypeFriendlyNames";
import { CardLibraryRow } from "./CardLibraryRow";

type Grouping = {
  Name: string;
  GetGroupsForCard: (cardState: CardState, appState: AppState) => string[];
  GetSection: React.FunctionComponent<{
    groupName: string;
    cards: CardState[];
  }>;
};

export const Groupings: Grouping[] = [
  {
    Name: "Type",
    GetGroupsForCard: (cardState: CardState) => [
      CardTypeFriendlyNames[cardState.type],
    ],
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
    Name: "Dashboard",
    GetGroupsForCard: (cardState: CardState, appState: AppState) => {
      const dashboardIds = Object.keys(appState.dashboardsById).filter(
        (dashboardId) =>
          appState.dashboardsById[dashboardId].openCardIds?.includes(
            cardState.cardId
          )
      );
      return dashboardIds;
    },
    GetSection: (props: { groupName: string; cards: CardState[] }) => {
      const { state } = useContext(ReducerContext);
      return (
        <Box flex={false} key={props.groupName}>
          <Heading level={3} margin="xsmall">
            {state.dashboardsById[props.groupName]?.name}
          </Heading>
          {props.cards.map((card) => (
            <CardLibraryRow
              key={props.groupName + "_" + card.cardId}
              card={card}
            />
          ))}
        </Box>
      );
    },
  },
  {
    Name: "Folder",
    GetGroupsForCard: (cardState: CardState) => [cardState.path ?? ""],
    GetSection: (props: { groupName: string; cards: CardState[] }) => {
      const [folderOpen, setFolderOpen] = useState(false);

      if (props.groupName === "") {
        return (
          <Box flex={false} key={props.groupName}>
            {props.cards.map((card) => (
              <CardLibraryRow showFolder key={card.cardId} card={card} />
            ))}
          </Box>
        );
      }

      if (!folderOpen) {
        return (
          <Box flex={false} key={props.groupName}>
            <Button
              justify="start"
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
              justify="start"
              icon={<FontAwesomeIcon icon={faFolderOpen} />}
              label={props.groupName}
              onClick={() => setFolderOpen(false)}
            />
            <Box pad="small" border={{ side: "left" }}>
              {props.cards.map((card) => (
                <CardLibraryRow showFolder key={card.cardId} card={card} />
              ))}
            </Box>
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
      const cardGroups = selectedGrouping.GetGroupsForCard(cardState, state);
      for (const group of cardGroups) {
        if (!hash[group]) {
          hash[group] = [];
        }
        hash[group].push(cardState);
      }
      return hash;
    },
    {}
  );

  const headersAndCards = Object.keys(cardsByGroup)
    .sort((a, b) => {
      if (a === "") {
        return 1;
      }
      if (b === "") {
        return -1;
      }
      return a.localeCompare(b);
    })
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
