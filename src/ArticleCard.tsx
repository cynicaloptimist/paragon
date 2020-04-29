import "./ArticleCard.css";

import React from "react";
import { BaseCard } from "./BaseCard";
import { Button, Text, TextArea } from "grommet";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";

export function ArticleCard(props: { cardId: string }) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const cardState = state.cardsById[props.cardId];

  const [editMode, setEditMode] = React.useState<boolean>(true);

  return (
    <BaseCard
      header={
        <>
          <Text style={{ flexGrow: 1 }}>Article</Text>
          <Button
            aria-label="toggle-edit-mode"
            onClick={() => setEditMode(!editMode)}
          >
            <FontAwesomeIcon size="xs" icon={editMode ? faCheck : faEdit} />
          </Button>
        </>
      }
    >
      {editMode ? (
        <TextArea
          style={{ height: "100%" }}
          className="article-card__text-field"
          value={cardState.content}
          onChange={(changeEvent) => {
            const content = changeEvent.target.value;
            dispatch(
              Actions.SetCardContent({
                cardId: props.cardId,
                content,
              })
            );
          }}
        />
      ) : (
        <Text style={{ whiteSpace: "pre" }}>{cardState.content}</Text>
      )}
    </BaseCard>
  );
}
