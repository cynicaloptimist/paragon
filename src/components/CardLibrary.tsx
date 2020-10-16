import { faFolder, faFolderOpen, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Heading } from "grommet";
import React, { useContext, useState } from "react";
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
    .map((cardGroup) => React.createElement(selectedGrouping.GetSection, {
      groupName: cardGroup,
      cards: cardsByGroup[cardGroup],
      key: cardGroup,
    })
    );

  return (
    <Box pad="xsmall" overflow={{ vertical: "auto" }}>
      <Button
        label={"By " + selectedGrouping.Name}
        icon={<FontAwesomeIcon size="sm" icon={faSort} />}
        onClick={() => {
          const nextGrouping = (groupingIndex + 1) % Groupings.length;
          setGroupingIndex(nextGrouping);
        }} />
      {headersAndCards}
    </Box>
  );
}
