import {
  faCheck,
  faCode,
  faEdit,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Markdown } from "grommet";
import React, { useContext } from "react";
import {
  ArticleCardState,
  PlayerViewPermission,
} from "../../../state/CardState";
import { BaseCard } from "../base/BaseCard";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { ArticleEditor } from "./ArticleEditor";
import { CardLink } from "./CardLink";

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
        // Crazy fill, overflow, and flexbox stuff to make the textarea focus border look correct
        <Box fill overflow={{ vertical: "auto" }}>
          <Box
            flex="grow"
            fill={isMarkdownEditorActive ? "vertical" : false}
            style={{ minHeight: isMarkdownEditorActive ? 0 : "unset" }}
            className="article-card-content"
            // Pad for the width of the Markdown add button
            pad={{ horizontal: "24px" }}
          >
            <ArticleEditor
              card={card}
              isMarkdownEditorActive={isMarkdownEditorActive}
            />
          </Box>
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
