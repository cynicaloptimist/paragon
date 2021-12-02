import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Image } from "grommet";
import React, { useContext, useState } from "react";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { ImageCardState } from "../../state/CardState";
import { BaseCard } from "./BaseCard";
import { FileUpload } from "./FileUpload";

export function ImageCard(props: { card: ImageCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;
  const [inputVisible, setInputVisible] = useState(false);

  let innerElement = (
    <Button
      label="Drag and drop an image from another tab, or click to input a URL"
      onClick={() => setInputVisible(true)}
      fill
    />
  );

  if (card.imageUrl.length > 0) {
    innerElement = (
      <Image fit="contain" alt="referenced image" src={card.imageUrl} />
    );
  }

  if (inputVisible) {
    innerElement = (
      <FileUpload
        card={props.card}
        onFileSelect={(file) => {
          setInputVisible(false);
          dispatch(
            CardActions.SetImageUrl({ cardId: card.cardId, imageUrl: file.url })
          );
        }}
        fileType="image"
        allowDirectLink
      />
    );
  }

  return (
    <BaseCard
      commands={
        <Button
          icon={<FontAwesomeIcon icon={faEdit} />}
          onClick={() => setInputVisible(true)}
        />
      }
      cardState={card}
    >
      <Box
        fill
        onDropCapture={(dropEvent) => {
          const imageUrl = dropEvent.dataTransfer.getData("URL");
          if (imageUrl) {
            dispatch(
              CardActions.SetImageUrl({ cardId: card.cardId, imageUrl })
            );
          }
        }}
      >
        {innerElement}
      </Box>
    </BaseCard>
  );
}
