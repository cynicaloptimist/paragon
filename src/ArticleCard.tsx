import React from "react";
import { BaseCard } from "./BaseCard";
import { Button, Text, TextArea, Markdown, Box } from "grommet";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ArticleCardState } from "./AppState";

export function ArticleCard(props: { card: ArticleCardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const { card } = props;

  const [isContentEditable, setContentEditable] = React.useState(true);

  return (
    <BaseCard
      cardId={card.cardId}
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
          style={{ height: "100%" }}
          className="article-card__text-field"
          value={card.content}
          onChange={(changeEvent) => {
            const content = changeEvent.target.value;
            dispatch(
              Actions.SetCardContent({
                cardId: card.cardId,
                content,
              })
            );
          }}
        />
      ) : (
        <Box pad={{ top: "0px" }}>
          <Markdown style={{ whiteSpace: "pre" }}>{card.content}</Markdown>
        </Box>
      )}
    </BaseCard>
  );
}
