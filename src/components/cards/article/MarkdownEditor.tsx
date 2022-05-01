import { Box, ThemeContext, ThemeType } from "grommet";
import React from "react";
import Editor from "rich-markdown-editor";
import base from "rich-markdown-editor/dist/styles/theme";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { ArticleCardState } from "../../../state/CardState";
import { useThemeColor } from "../../hooks/useThemeColor";

import styled from "styled-components";

const StyledEditor = styled(Editor)`
  font-size: 18px;
  p {
    line-height: 24px;
    margin-block-end: 1em;
  }
`;

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
      style={{ cursor: "text", borderStyle: "dotted", padding: "8px 0" }}
      onClick={() => {
        if (markdownEditor.current && markdownEditor.current.isBlurred) {
          markdownEditor.current.focusAtEnd();
        }
      }}
    >
      <StyledEditor
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
          const card = state.cardsById[maybeCardId];
          if (card) {
            dispatch(
              CardActions.OpenCard({ cardId: maybeCardId, cardType: card.type })
            );
          } else {
            window.open(href, "_blank");
          }
        }}
        theme={{
          ...base,
          toolbarBackground: themeColors.secondary,
          toolbarHoverBackground: themeColors.secondary,
          toolbarItem: themeColors.text,
          toolbarInput: themeColors.text,
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
