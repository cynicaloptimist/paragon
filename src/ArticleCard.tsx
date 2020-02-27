import "./ArticleCard.css";

import React from "react";
import { BaseCard } from "./BaseCard";
import { Typography, TextField } from "@material-ui/core";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";

export function ArticleCard(props: { cardId: string }) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const cardState = state.cardsById[props.cardId];

  const fullHeightStyle = {
    style: {
      height: "100%"
    }
  };

  return (
    <BaseCard header={<Typography>Article</Typography>}>
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
    </BaseCard>
  );
}
