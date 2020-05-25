import React, { useContext } from "react";
import { BaseCard } from "./BaseCard";
import { ImageCardState } from "./CardState";
import { Button, Image, Box } from "grommet";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";

export function ImageCard(props: { card: ImageCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  return (
    <BaseCard commands={null} cardId={card.cardId}>
      <Box
        fill
        onDropCapture={(dropEvent) => {
          const imageUrl = dropEvent.dataTransfer.getData("URL");
          dispatch(Actions.SetImageUrl({ cardId: card.cardId, imageUrl }));
        }}
      >
        {card.imageUrl.length ? (
          <Image fit="contain" alt="" src={card.imageUrl} />
        ) : (
          <Button label="Drop" />
        )}
      </Box>
    </BaseCard>
  );
}
