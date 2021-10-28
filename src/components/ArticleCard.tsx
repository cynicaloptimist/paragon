import {
  faCheck,
  faCode,
  faEdit,
  faFont
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Markdown,
  Text,
  TextArea,
  ThemeContext,
  ThemeType
} from "grommet";
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
  const [isMarkdownEditorActive, setMarkdownEditorActive] =
    React.useState(false);

  const viewType = useContext(ViewTypeContext);

  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

  return (
    <BaseCard
      cardState={card}
      commands={
        <>
          {isContentEditable && (
            <Button
              aria-label="toggle-markdown-editing"
              onClick={() => setMarkdownEditorActive(!isMarkdownEditorActive)}
              icon={
                <FontAwesomeIcon
                  icon={isMarkdownEditorActive ? faFont : faCode}
                />
              }
            />
          )}
          <Button
            aria-label="toggle-edit-mode"
            onClick={() => canEdit && setContentEditable(!isContentEditable)}
            icon={
              <FontAwesomeIcon icon={isContentEditable ? faCheck : faEdit} />
            }
          />
        </>
      }
    >
      {isContentEditable ? (
        <ArticleEditor
          card={card}
          isMarkdownEditorActive={isMarkdownEditorActive}
        />
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
            {card.content.replace(/\\\n/g, "\n")}
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

function ArticleEditor(props: {
  card: ArticleCardState;
  isMarkdownEditorActive: boolean;
}) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const [content, setContent] = React.useState(props.card.content);
  const themeColors = {
    primary: useThemeColor("brand"),
    secondary: useThemeColor("brand-2"),
    text: useThemeColor("text"),
    background: useThemeColor("background"),
  };
  const theme: ThemeType = React.useContext(ThemeContext);

  const saveCardContent = () => {
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
  };

  if (props.isMarkdownEditorActive) {
    return (
      <TextArea
        fill
        autoFocus
        defaultValue={props.card.content}
        onChange={(changeEvent) => {
          setContent(changeEvent.target.value);
        }}
        onBlur={saveCardContent}
      />
    );
  } else {
    return (
      <Editor
        autoFocus
        defaultValue={props.card.content}
        onChange={(getValue) => {
          setContent(getValue());
        }}
        onBlur={saveCardContent}
        disableExtensions={["container_notice", "highlight"]}
        theme={{
          ...light,
          toolbarBackground: themeColors.primary,
          toolbarHoverBackground: themeColors.primary,
          toolbarItem: themeColors.text,
          background: themeColors.background,
          codeBackground: themeColors.background,
        }}
        style={{
          margin: theme.global?.edgeSize?.small || "6",
          font: theme.global?.font?.family || "inherit",
        }}
      />
    );
  }
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
