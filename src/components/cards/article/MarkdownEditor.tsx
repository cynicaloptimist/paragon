import { Box, ThemeContext, ThemeType } from "grommet";
import React from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { ArticleCardState } from "../../../state/CardState";
import { useThemeColor } from "../../hooks/useThemeColor";

import styled from "styled-components";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";
import { DashboardActions } from "../../../actions/DashboardActions";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  CreateLink,
  headingsPlugin,
  imagePlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import _ from "lodash";

const EditorContainer = styled(Box)<{ theme: ThemeType }>`
  cursor: text;
  border-style: dotted;
  .editor-content {
    font-family: ${(p) => p.theme.global?.font?.family || "inherit"};
    color: ${(p) => p.theme.global?.colors?.text?.light || "inherit"};
    ${(p) => {
      const headerStyles = _.range(1, 7).map((level) => {
        const headingTheme = p.theme.heading;
        const levelTheme = p.theme.heading?.level?.[level].medium;
        return `h${level} {
          font-family: ${headingTheme?.font?.family || "inherit"};
          font-weight: ${headingTheme?.weight || "inherit"};
          font-size: ${levelTheme?.size || "inherit"};
          line-height: ${levelTheme?.height || "inherit"};
        }`;
      });
      return headerStyles.join("\n");
    }}
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
  const markdownEditor = React.useRef<MDXEditorMethods>(null);

  return (
    <EditorContainer
      theme={theme}
      fill
      onClick={() => {
        if (markdownEditor.current) {
          markdownEditor.current.focus();
        }
      }}
    >
      <MDXEditor
        autoFocus
        markdown={props.card.content}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          imagePlugin(),
          tablePlugin(),
          codeBlockPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle />
              </>
            ),
          }),
        ]}
        onChange={(markdown: string) => {
          props.setContent(markdown);
        }}
        // onClickLink={(href: string) => {
        //   const url = new URL(href);
        //   const maybeCardId = url.pathname.replace(/^\//, "");
        //   const card = state.cardsById[maybeCardId];
        //   if (dashboardId && card) {
        //     dispatch(
        //       DashboardActions.OpenCard({
        //         dashboardId,
        //         cardId: maybeCardId,
        //         cardType: card.type,
        //       })
        //     );
        //   } else {
        //     window.open(href, "_blank");
        //   }
        // }}
        contentEditableClassName="editor-content"
        ref={markdownEditor}
      />
    </EditorContainer>
  );
}
