import {
  faCheck,
  faCode,
  faEdit,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Markdown,
  Text,
  TextArea,
  ThemeContext,
  ThemeType,
} from "grommet";
import React, { useContext } from "react";
import Editor from "rich-markdown-editor";
import base from "rich-markdown-editor/dist/styles/theme";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardsState } from "../../state/AppState";
import { ArticleCardState, PlayerViewPermission } from "../../state/CardState";
import { BaseCard } from "./BaseCard";
import { useThemeColor } from "../hooks/useThemeColor";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";

export function ArticleCard(props: { card: ArticleCardState }) {
  const { card } = props;

  const [isMarkdownEditorActive, setMarkdownEditorActive] =
    React.useState(false);

  const viewType = useContext(ViewTypeContext);

  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

  const [isContentEditable, setContentEditable] = React.useState(
    canEdit && card.content.length === 0
  );

  return (
    <BaseCard
      cardState={card}
      commands={
        <>
          {canEdit && isContentEditable && (
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
        <Box
          fill
          pad={{ horizontal: "medium" }}
          overflow={{ vertical: "auto" }}
        >
          <ArticleEditor
            card={card}
            isMarkdownEditorActive={isMarkdownEditorActive}
          />
        </Box>
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
      <MarkdownEditor
        card={props.card}
        setContent={setContent}
        saveCardContent={saveCardContent}
      />
    );
  }
}

function MarkdownEditor(props: {
  card: ArticleCardState;
  setContent: (content: string) => void;
  saveCardContent: () => void;
}) {
  const themeColors = {
    primary: useThemeColor("brand"),
    secondary: useThemeColor("brand-2"),
    text: useThemeColor("text"),
    background: useThemeColor("background"),
  };
  const theme: ThemeType = React.useContext(ThemeContext);
  const markdownEditor = React.useRef<Editor>(null);

  return (
    <Box
      fill
      style={{ cursor: "text" }}
      onClick={() => {
        if (markdownEditor.current && markdownEditor.current.isBlurred) {
          markdownEditor.current.focusAtEnd();
        }
      }}
    >
      <Editor
        autoFocus
        defaultValue={props.card.content}
        placeholder=""
        onChange={(getValue) => {
          props.setContent(getValue());
        }}
        onBlur={props.saveCardContent}
        disableExtensions={["container_notice", "highlight"]}
        theme={{
          ...base,
          toolbarBackground: themeColors.primary,
          toolbarHoverBackground: themeColors.primary,
          background: themeColors.background,
          codeBackground: themeColors.background,
          blockToolbarBackground: themeColors.background,
        }}
        style={{
          font: theme.global?.font?.family || "inherit",
        }}
        ref={markdownEditor}
      />
    </Box>
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