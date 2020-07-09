import React from "react";
import { BaseCard } from "./BaseCard";
import { Button, TextArea, Markdown, Box } from "grommet";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardActions } from "../actions/Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ArticleCardState } from "../state/CardState";

export function ArticleCard(props: { card: ArticleCardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const { card } = props;

  const [isContentEditable, setContentEditable] = React.useState(
    card.content.length === 0
  );

  const [content, setContent] = React.useState(card.content);

  return (
    <BaseCard
      cardState={card}
      commands={
        <Button
          aria-label="toggle-edit-mode"
          onClick={() => setContentEditable(!isContentEditable)}
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
            dispatch(
              CardActions.SetCardContent({
                cardId: card.cardId,
                content,
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
          <Markdown style={{ whiteSpace: "pre-wrap" }}>{card.content}</Markdown>
        </Box>
      )}
    </BaseCard>
  );
}
