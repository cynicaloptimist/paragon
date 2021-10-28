import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Markdown, Text } from "grommet";
import React, { useContext } from "react";
import Editor from "rich-markdown-editor";
import light from "rich-markdown-editor/dist/styles/theme";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardsState } from "../state/AppState";
import { ArticleCardState, PlayerViewPermission } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { useThemeColor } from "./hooks/useThemeColor";
import { ViewType, ViewTypeContext } from "./ViewTypeContext";

export function ArticleCard(props: { card: ArticleCardState }) {
  const { card } = props;

  const [isContentEditable, setContentEditable] = React.useState(
    card.content.length === 0
  );

  const viewType = useContext(ViewTypeContext);

  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

  return (
    <BaseCard
      cardState={card}
      commands={
        <Button
          aria-label="toggle-edit-mode"
          onClick={() => canEdit && setContentEditable(!isContentEditable)}
          icon={<FontAwesomeIcon icon={isContentEditable ? faCheck : faEdit} />}
        />
      }
    >
      {isContentEditable ? (
        <ArticleEditor card={card} />
      ) : (
        <Box
          fill
          pad="small"
          onDoubleClick={() => canEdit && setContentEditable(true)}
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

function ArticleEditor(props: { card: ArticleCardState }) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const [content, setContent] = React.useState(props.card.content);
  const themeColors = {
    primary: useThemeColor("brand"),
    secondary: useThemeColor("brand-2"),
    text: useThemeColor("text"),
  };

  return (
    <Editor
      autoFocus
      defaultValue={props.card.content}
      onChange={(getValue) => {
        setContent(getValue());
      }}
      onBlur={() => {
        const updatedContent = ConvertDoubleBracketsToWikiLinks(
          content,
          state.cardsById
        );
        dispatch(
          CardActions.SetCardContent({
            cardId: props.card.cardId,
            content: updatedContent,
          })
        );
      }}
      disableExtensions={["container_notice", "highlight"]}
      theme={{
        ...light,
        toolbarBackground: themeColors.primary,
        toolbarHoverBackground: themeColors.primary,
        toolbarItem: themeColors.text,
      }}
    />
  );
}

function ConvertDoubleBracketsToWikiLinks(
  markdownString: string,
  cards: CardsState
): string {
  return markdownString.replace(/\[\[([\w\d ]+)\]\]/g, (match, inner) => {
    const matchedCard = Object.values(cards).find(
      (card) => card.title.localeCompare(inner) === 0
    );
    if (!matchedCard) {
      return match;
    }
    return "[" + inner + "](" + matchedCard.cardId + ")";
  });
}
