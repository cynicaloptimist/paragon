import { AccordionPanel, Box, BoxExtendedProps } from "grommet";
import React, { useContext } from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { AppState } from "../../../state/AppState";
import { CardState } from "../../../state/CardState";
import { CardTypeFriendlyNames } from "../../../state/CardTypes";
import { CardLibraryRow } from "./CardLibraryRow";

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
export type CardGrouping = {
  Name: string;
  GetGroupsForCard: (cardState: CardState, appState: AppState) => string[];
  GetSection: React.FunctionComponent<{
    groupName: string;
    cards: CardState[];
  }>;
};
