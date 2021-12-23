import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fuse from "fuse.js";
import {
  Accordion,
  AccordionPanel,
  Box,
  BoxExtendedProps,
  Button,
  TextInput,
} from "grommet";
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
    Name: "Card Type",
    GetGroupsForCard: (cardState: CardState) => [
      CardTypeFriendlyNames[cardState.type],
    ],
    GetSection: (props: { groupName: string; cards: CardState[] }) => {
      return (
        <AccordionPanel label={props.groupName}>
          {props.cards.map((card) => (
            <CardLibraryRow key={card.cardId} card={card} />
          ))}
        </AccordionPanel>
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
        <AccordionPanel label={state.dashboardsById[props.groupName]?.name}>
          {props.cards.map((card) => (
            <CardLibraryRow
              key={props.groupName + "_" + card.cardId}
              card={card}
            />
          ))}
        </AccordionPanel>
      );
    },
  },
  {
    Name: "Folder",
    GetGroupsForCard: (cardState: CardState) => [cardState.path ?? ""],
    GetSection: (props: { groupName: string; cards: CardState[] }) => {
      if (props.groupName === "") {
        return (
          <AccordionPanel label="(no folder)">
            {props.cards.map((card) => (
              <CardLibraryRow showFolder key={card.cardId} card={card} />
            ))}
          </AccordionPanel>
        );
      }

      return (
        <AccordionPanel label={props.groupName}>
          {props.cards.map((card) => (
            <CardLibraryRow showFolder key={card.cardId} card={card} />
          ))}
        </AccordionPanel>
      );
    },
  },
];

export function CardLibrary() {
  const { state } = useContext(ReducerContext);
  const [groupingIndex, setGroupingIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const cards = Object.values(state.cardsById);
  const fuse = useMemo(() => new Fuse(cards, { keys: ["title"] }), [cards]);
  const boxProps: BoxExtendedProps = {
    pad: "xsmall",
    overflow: { vertical: "auto" },
  };

  if (searchTerm.length > 0) {
    const searchResults = fuse.search(searchTerm);
    return (
      <Box {...boxProps}>
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
    <Box {...boxProps}>
      <TextInput
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        tip={{
          content: "Change sorting",
          dropProps: {
            stretch: false,
            align: {
              bottom: "top",
              right: "right",
            },
          },
        }}
        label={selectedGrouping.Name}
        icon={<FontAwesomeIcon icon={faSort} />}
        onClick={() => {
          const nextGrouping = (groupingIndex + 1) % Groupings.length;
          setGroupingIndex(nextGrouping);
        }}
      />
      <Accordion>{headersAndCards}</Accordion>
    </Box>
  );
}
