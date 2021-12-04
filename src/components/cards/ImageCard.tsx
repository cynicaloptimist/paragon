import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Image } from "grommet";
import React, { useContext, useState } from "react";
import { CardActions } from "../../actions/CardActions";
import { FirebaseUtils } from "../../FirebaseUtils";
import { ReducerContext } from "../../reducers/ReducerContext";
import { ImageCardState } from "../../state/CardState";
import { useUserId } from "../hooks/useAccountSync";
import { BaseCard } from "./BaseCard";
import { FileUpload } from "./FileUpload";

export function ImageCard(props: { card: ImageCardState }) {
  const { state, dispatch } = useContext(ReducerContext);
  const userId = useUserId();
  const hasStorage = userId && state.user.hasStorage;
  const { card } = props;
  const [inputVisible, setInputVisible] = useState(false);

  let innerElement = (
    <Button
      label="Drag and drop an image from another tab, or click to input a URL"
      onClick={() => setInputVisible(true)}
      fill
    />
  );

  if(hasStorage) {
    innerElement.props.label = "Drag and drop from a file or tab, or click to view files"
  }

  if (card.imageUrl.length > 0) {
    innerElement = (
      <Image fit="contain" alt="referenced image" src={card.imageUrl} />
    );
  }

  if (inputVisible) {
    innerElement = (
      <FileUpload
        card={props.card}
        currentUrl={props.card.imageUrl}
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
        onDropCapture={async (dropEvent) => {
          const imageUrl = dropEvent.dataTransfer.getData("URL");
          if (imageUrl) {
            dispatch(
              CardActions.SetImageUrl({ cardId: card.cardId, imageUrl })
            );
            return;
          }
          const imageUpload = dropEvent.dataTransfer.files?.[0];
          if (hasStorage && imageUpload) {
            const imageUrl = await FirebaseUtils.UploadUserFileToStorageAndGetURL(imageUpload, userId, "image");
            dispatch(
              CardActions.SetImageUrl({ cardId: card.cardId, imageUrl })
            );
            return;
          }
        }}
      >
        {innerElement}
      </Box>
    </BaseCard>
  );
}
