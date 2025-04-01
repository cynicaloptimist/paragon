import { Box, ThemeContext, ThemeType } from "grommet";
import React from "react";
import { ArticleCardState } from "../../../state/CardState";
import { useThemeColor } from "../../hooks/useThemeColor";

import styled from "styled-components";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  CreateLink,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
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
import { LinkDialog } from "./LinkDialog";

const EditorContainer = styled(Box)<{ theme: ThemeType; themeColor: string }>`
  .editor-toolbar {
    background-color: ${(p) => p.theme.global?.colors?.background || "inherit"};
    border-bottom: 1px solid ${(p) => p.themeColor};
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;
  }

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

    border-bottom: 2px dotted ${(p) =>
      p.theme.global?.colors?.["text-fade"]?.light || "inherit"};
  }

  a {
    color: ${(p) => p.theme.global?.colors?.link?.light || "inherit"};
    font-weight: bold;
  }
`;

export default function MarkdownEditor(props: {
  card: ArticleCardState;
  setContent: (content: string) => void;
}) {
  const themeColors = {
    primary: useThemeColor("brand"),
    secondary: useThemeColor("brand-2"),
    text: useThemeColor("text-dark"),
    background: useThemeColor("background"),
  };
  const theme: ThemeType = React.useContext(ThemeContext);
  const markdownEditor = React.useRef<MDXEditorMethods>(null);
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);

  return (
    <EditorContainer theme={theme} themeColor={themeColors.primary} fill>
      <MDXEditor
        autoFocus
        markdown={props.card.content}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin({
            LinkDialog: () => (
              <LinkDialog toolbarPortalRef={toolbarPortalRef} />
            ),
          }),
          imagePlugin(),
          tablePlugin(),
          codeBlockPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarClassName: "editor-toolbar",
            toolbarContents: () => (
              <>
                <Box>
                  <Box flex direction="row">
                    <UndoRedo />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <Separator />
                    <BlockTypeSelect />
                    <Separator />
                    <ListsToggle />
                    <Separator />
                    <CreateLink />
                  </Box>
                  <div ref={toolbarPortalRef} />
                </Box>
              </>
            ),
          }),
        ]}
        onChange={(markdown: string) => {
          props.setContent(markdown);
        }}
        contentEditableClassName="editor-content"
        ref={markdownEditor}
      />
    </EditorContainer>
  );
}
