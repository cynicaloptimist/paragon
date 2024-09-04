import { Box, ThemeContext, ThemeType } from "grommet";
import React from "react";
import base from "rich-markdown-editor/dist/styles/theme";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { ArticleCardState } from "../../../state/CardState";
import { useThemeColor } from "../../hooks/useThemeColor";

import styled from "styled-components";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";
import { DashboardActions } from "../../../actions/DashboardActions";
import RichMarkdownEditor from "rich-markdown-editor";

const Editor = React.lazy(() => import("rich-markdown-editor"));

const StyledEditor = styled(Editor as any)`
  font-size: 18px;
  h2,
  h3,
  p,
  ul,
  ol {
    margin-block: 4px;
  }
`;

export function MarkdownEditor(props: {
  card: ArticleCardState;
  setContent: (content: string) => void;
}) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const themeColors = {
    primary: useThemeColor("brand"),
    secondary: useThemeColor("brand-2"),
    text: useThemeColor("text-dark"),
    background: useThemeColor("background"),
  };
  const theme: ThemeType = React.useContext(ThemeContext);
  const markdownEditor = React.useRef<RichMarkdownEditor>(null);

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
        onChange={(getValue: () => string) => {
          try {
            props.setContent(getValue());
          } catch (e) {
            console.warn("Editor onChange threw: ", e);
          }
        }}
        disableExtensions={["container_notice", "highlight"]}
        onClickLink={(href: string) => {
          const url = new URL(href);
          const maybeCardId = url.pathname.replace(/^\//, "");
          const card = state.cardsById[maybeCardId];
          if (dashboardId && card) {
            dispatch(
              DashboardActions.OpenCard({
                dashboardId,
                cardId: maybeCardId,
                cardType: card.type,
              })
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
