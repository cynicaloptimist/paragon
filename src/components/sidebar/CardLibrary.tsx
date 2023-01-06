import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fuse from "fuse.js";
import {
  Accordion,
  AccordionPanel,
  Box,
  BoxExtendedProps,
  Button,
  Heading,
  TextInput,
} from "grommet";
import React, { useContext, useMemo, useState } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState } from "../../state/AppState";
import { CardState } from "../../state/CardState";
import { CardTypeFriendlyNames } from "../../state/CardTypes";
import { CardLibraryRow } from "./CardLibraryRow";

type Grouping = {
  Name: string;
  GetGroupsForCard: (cardState: CardState, appState: AppState) => string[];
  GetSection: React.FunctionComponent<{
    groupName: string;
    cards: CardState[];
  }>;
};

const accordionBoxProps: BoxExtendedProps = {
  gap: "xsmall",
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
          <Box {...accordionBoxProps}>
            {props.cards.map((card) => (
              <CardLibraryRow key={card.cardId} card={card} />
            ))}
          </Box>
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
          <Box {...accordionBoxProps}>
            {props.cards.map((card) => (
              <CardLibraryRow
                key={props.groupName + "_" + card.cardId}
                card={card}
              />
            ))}
          </Box>
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
            <Box {...accordionBoxProps}>
              {props.cards.map((card) => (
                <CardLibraryRow showFolder key={card.cardId} card={card} />
              ))}
            </Box>
          </AccordionPanel>
        );
      }

      return (
        <AccordionPanel label={props.groupName}>
          <Box {...accordionBoxProps}>
            {props.cards.map((card) => (
              <CardLibraryRow showFolder key={card.cardId} card={card} />
            ))}
          </Box>
        </AccordionPanel>
      );
    },
  },
];

export function CardLibrary() {
  const { state } = useContext(ReducerContext);
  const [groupingIndex, setGroupingIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const cards = Object.keys(state.cardsById).map((cardId) => {
    return {
      ...state.cardsById[cardId],
      cardId, // This helps to ensure that CardActions will work in case of a malformed CardState
    };
  });
  const fuse = useMemo(
    () => new Fuse(cards, { keys: ["title", "content"] }),
    [cards]
  );
  const boxProps: BoxExtendedProps = {
    pad: "xsmall",
    gap: "small",
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
      <Box
        flex={false}
        direction="row"
        align="center"
        justify="between"
        pad={{ horizontal: "xsmall" }}
        border={{ side: "bottom" }}
      >
        <Heading level={4} style={{ fontStyle: "italic" }}>
          Sorted by {selectedGrouping.Name}
        </Heading>
        <Button
          margin="none"
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
          icon={<FontAwesomeIcon icon={faSort} />}
          onClick={() => {
            const nextGrouping = (groupingIndex + 1) % Groupings.length;
            setGroupingIndex(nextGrouping);
          }}
        />
      </Box>
      <Accordion key={selectedGrouping.Name}>{headersAndCards}</Accordion>
    </Box>
  );
}
