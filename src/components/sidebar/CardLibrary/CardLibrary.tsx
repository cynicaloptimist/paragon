import { faGlobe, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fuse from "fuse.js";
import {
  Accordion,
  AccordionPanel,
  Box,
  BoxExtendedProps,
  Button,
  Heading,
  Text,
  TextInput,
  Tip,
} from "grommet";
import React, { useContext, useMemo, useState } from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { AppState, isDefined } from "../../../state/AppState";
import { CardState } from "../../../state/CardState";
import { CardTypeFriendlyNames } from "../../../state/CardTypes";
import { CardLibraryRow } from "./CardLibraryRow";

type CardGrouping = {
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

export const CardGroupings: CardGrouping[] = [
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
        (dashboardId) => {
          return appState.dashboardsById[dashboardId]?.openCardIds?.includes(
            cardState.cardId
          );
        }
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
  const cards = Object.keys(state.cardsById)
    .map<CardState | undefined>((cardId) => {
      const cardState = state.cardsById[cardId];
      if (!cardState) {
        return undefined;
      }
      return {
        ...cardState,
        cardId, // This helps to ensure that CardActions will work in case of a malformed CardState
      };
    })
    .filter(isDefined)
    .filter((card) => {
      if (!state.activeCampaignId) {
        return true;
      }
      if (!card.campaignId) {
        return true;
      }
      if (!state.campaignsById[card.campaignId]) {
        return true;
      }
      return card.campaignId === state.activeCampaignId;
    });
  const fuse = useMemo(
    () =>
      new Fuse(cards, {
        keys: [
          { name: "title", weight: 1 },
          { name: "content", weight: 0.5 },
        ],
        ignoreLocation: true,
      }),
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
        <CampaignHeader />
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

  const selectedGrouping = CardGroupings[groupingIndex];

  if (!selectedGrouping) {
    return null;
  }

  const cardsByGroup = Object.values(cards)
    .filter(isDefined)
    .reduce((hash: Record<string, CardState[]>, cardState) => {
      const cardGroups = selectedGrouping.GetGroupsForCard(cardState, state);
      for (const group of cardGroups) {
        if (!hash[group]) {
          hash[group] = [];
        }
        hash[group]!.push(cardState);
      }
      return hash;
    }, {});

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
    .map((cardGroup) => {
      const cards = cardsByGroup[cardGroup];
      if (!cards) {
        return null;
      }
      return React.createElement(selectedGrouping.GetSection, {
        groupName: cardGroup,
        cards,
        key: cardGroup,
      });
    });

  return (
    <Box {...boxProps}>
      <CampaignHeader />
      <TextInput
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Tip
        content="Change Sorting"
        dropProps={{
          stretch: false,
          align: {
            bottom: "top",
            right: "right",
          },
        }}
      >
        <Box
          flex={false}
          direction="row"
          align="center"
          justify="between"
          pad={{ horizontal: "xsmall" }}
          border={{ side: "bottom" }}
          onClick={() => {
            const nextGrouping = (groupingIndex + 1) % CardGroupings.length;
            setGroupingIndex(nextGrouping);
          }}
        >
          <Heading level={4} style={{ fontStyle: "italic" }}>
            Sorted by {selectedGrouping.Name}
          </Heading>
          <FontAwesomeIcon icon={faSort} />
        </Box>
      </Tip>
      <Accordion key={selectedGrouping.Name}>{headersAndCards}</Accordion>
    </Box>
  );
}

function CampaignHeader() {
  const { state } = useContext(ReducerContext);
  if (state.activeCampaignId) {
    const activeCampaign = state.campaignsById[state.activeCampaignId];
    if (activeCampaign) {
      return (
        <Text>
          <Tip content="Cards shown for Active Campaign">
            <Button icon={<FontAwesomeIcon icon={faGlobe} />} />
          </Tip>
          {activeCampaign.title}
        </Text>
      );
    }
  }
  return null;
}
