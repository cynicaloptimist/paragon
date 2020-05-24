import React, { useState } from "react";
import { BaseCard } from "./BaseCard";
import { ImageCardState } from "./CardState";
import { Button, Image, Box } from "grommet";

export function ImageCard(props: { card: ImageCardState }) {
  const { card } = props;
  const [url, setUrl] = useState("");

  return (
    <BaseCard commands={null} cardId={card.cardId}>
      <Box
        fill
        onDropCapture={(dropEvent) => {
          const imageUrl = dropEvent.dataTransfer.getData("URL");
          setUrl(imageUrl);
        }}
      >
        {url.length ? (
          <Image fit="contain" alt="" src={url} />
        ) : (
          <Button label="Drop" />
        )}
      </Box>
    </BaseCard>
  );
}
