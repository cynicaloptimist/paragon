import { Box, ThemeContext, ThemeType } from "grommet";
import React from "react";
import Editor from "rich-markdown-editor";
import base from "rich-markdown-editor/dist/styles/theme";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { ArticleCardState } from "../../../state/CardState";
import { useThemeColor } from "../../hooks/useThemeColor";

export function MarkdownEditor(props: {
  card: ArticleCardState;
  setContent: (content: string) => void;
}) {
  const { state, dispatch } = React.useContext(ReducerContext);
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
          try {
            props.setContent(getValue());
          } catch (e) {
            console.warn("Editor onChange threw: ", e);
          }
        }}
        disableExtensions={["container_notice", "highlight"]}
        onClickLink={(href) => {
          const url = new URL(href);
          const maybeCardId = url.pathname.replace(/^\//, "");
          if (state.cardsById[maybeCardId]) {
            dispatch(CardActions.OpenCard({ cardId: maybeCardId }));
          } else {
            window.open(href, "_blank");
          }
        }}
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
