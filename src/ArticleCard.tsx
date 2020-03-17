import "./ArticleCard.css";

import React from "react";
import { BaseCard } from "./BaseCard";
import { Typography, TextField, IconButton } from "@material-ui/core";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";

export function ArticleCard(props: { cardId: string }) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const cardState = state.cardsById[props.cardId];

  const fullHeightStyle = {
    style: {
      height: "100%"
    }
  };

  const [editMode, setEditMode] = React.useState<boolean>(true);

  return (
    <BaseCard
      header={
        <>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle-edit-mode"
            onClick={() => setEditMode(!editMode)}
          >
            <FontAwesomeIcon icon={editMode ? faCheck : faEdit} />
          </IconButton>
          <Typography>Article</Typography>
        </>
      }
    >
      {editMode ? (
        <TextField
          className="article-card__text-field"
          multiline
          variant="outlined"
          inputProps={fullHeightStyle}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          value={cardState.content}
          onChange={changeEvent => {
            const content = changeEvent.target.value;
            dispatch(
              Actions.SetCardContent({
                cardId: props.cardId,
                content
              })
            );
          }}
        />
      ) : (
        <Typography style={{ whiteSpace: "pre" }}>
          {cardState.content}
        </Typography>
      )}
    </BaseCard>
  );
}
