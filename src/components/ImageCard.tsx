import { Box, Button, Image, TextInput } from "grommet";
import React, { useContext, useState } from "react";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { ImageCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";

export function ImageCard(props: { card: ImageCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;
  const [inputVisible, setInputVisible] = useState(false);
  const [urlInput, setUrlInput] = useState(card.imageUrl);

  let innerElement = (
    <Button
      label="Drag and drop an image from another tab, or click to input a URL"
      onClick={() => setInputVisible(true)}
      fill
    />
  );

  if (card.imageUrl.length > 0) {
    innerElement = (
      <Image
        fit="contain"
        alt="referenced image"
        onClick={() => setInputVisible(true)}
        src={card.imageUrl}
      />
    );
  }

  if (inputVisible) {
    innerElement = (
      <TextInput
        value={urlInput}
        onChange={(event) => {
          setUrlInput(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter") {
            return;
          }
          setInputVisible(false);
          dispatch(
            CardActions.SetImageUrl({ cardId: card.cardId, imageUrl: urlInput })
          );
        }}
        autoFocus
      />
    );
  }

  return (
    <BaseCard commands={null} cardState={card}>
      <Box
        fill
        onDropCapture={(dropEvent) => {
          const imageUrl = dropEvent.dataTransfer.getData("URL");
          dispatch(CardActions.SetImageUrl({ cardId: card.cardId, imageUrl }));
        }}
      >
        {innerElement}
      </Box>
    </BaseCard>
  );
}
