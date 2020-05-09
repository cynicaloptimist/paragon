import React from "react";
import { BaseCard } from "./BaseCard";
import { Button, TextArea, Markdown, Box } from "grommet";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ArticleCardState } from "./CardState";

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
          fill
          defaultValue={card.content}
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
        <Box pad="small">
          <Markdown style={{ whiteSpace: "pre" }}>
            {card.content}
          </Markdown>
        </Box>
      )}
    </BaseCard>
  );
}
