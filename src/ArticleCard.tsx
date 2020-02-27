import "./ArticleCard.css";

import React from "react";
import { BaseCard } from "./BaseCard";
import { Typography, TextField } from "@material-ui/core";

export function ArticleCard(props: { cardId: string }) {
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
      />
    </BaseCard>
  );
}
