import React, { useContext } from "react";
import { BaseCard } from "./BaseCard";
import { Button, TextArea, Markdown, Box, Text } from "grommet";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardActions } from "../actions/Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ArticleCardState, CardState } from "../state/CardState";
import { PlayerViewContext } from "./PlayerViewContext";
import { CardsState } from "../state/AppState";

export function ArticleCard(props: { card: ArticleCardState }) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const { card } = props;

  const [isContentEditable, setContentEditable] = React.useState(
    card.content.length === 0
  );

  const [content, setContent] = React.useState(card.content);
  const canEdit = useContext(PlayerViewContext) === null;

  return (
    <BaseCard
      cardState={card}
      commands={
        <Button
          aria-label="toggle-edit-mode"
          onClick={() => canEdit && setContentEditable(!isContentEditable)}
          icon={
            <FontAwesomeIcon
              size="xs"
              icon={isContentEditable ? faCheck : faEdit}
            />
          }
        />
      }
    >
      {isContentEditable ? (
        <TextArea
          fill
          autoFocus
          defaultValue={card.content}
          onChange={(changeEvent) => {
            setContent(changeEvent.target.value);
          }}
          onBlur={() => {
            const updatedContent = ConvertDoubleBracketsToWikiLinks(
              content,
              state.cardsById
            );
            dispatch(
              CardActions.SetCardContent({
                cardId: card.cardId,
                content: updatedContent,
              })
            );
          }}
        />
      ) : (
        <Box
          fill
          pad="small"
          onDoubleClick={() => setContentEditable(true)}
          overflow={{ vertical: "auto" }}
        >
          <Markdown
            style={{ whiteSpace: "pre-wrap" }}
            components={{
              a: {
                component: CardLink,
              },
            }}
          >
            {card.content}
          </Markdown>
        </Box>
      )}
    </BaseCard>
  );
}

const CardLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { state, dispatch } = React.useContext(ReducerContext);
  const cardId = props.href || "";
  if (!state.cardsById[cardId]) {
    return (
      <a {...props} target="_blank">
        {props.children}
      </a>
    );
  }
  return (
    <Text
      color="link"
      style={{ textDecoration: "underline", cursor: "pointer" }}
      onClick={() => {
        dispatch(CardActions.OpenCard({ cardId }));
      }}
    >
      {props.children}
    </Text>
  );
};

function ConvertDoubleBracketsToWikiLinks(
  markdownString: string,
  cards: CardsState
): string {
  return markdownString.replace(/\[\[([\w\d ]+)\]\]/g, (match, inner) => {
    const matchedCard = Object.values(cards).find((card) =>
      card.title.localeCompare(inner)
    );
    if (!matchedCard) {
      return match;
    }
    return "[" + inner + "](" + matchedCard.cardId + ")";
  });
}
