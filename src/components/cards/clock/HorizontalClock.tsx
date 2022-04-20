import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import * as React from "react";
import { ClockCardState, PlayerViewPermission } from "../../../state/CardState";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { useOnClickSegment } from "./useOnClickSegment";

export function HorizontalClock(props: { card: ClockCardState }) {
  const viewType = React.useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  const onClickSegment = useOnClickSegment(props);
  let segments = [];
  for (let i = 0; i < props.card.max; i++) {
    const color = i < props.card.value ? "brand" : "light-6";
    segments.push(
      <Box
        key={i}
        fill
        hoverIndicator={canEdit && { color: "brand-2" }}
        background={color}
        onClick={canEdit ? () => onClickSegment(i) : undefined}
      />
    );
  }
  return (
    <Box direction="row" align="center" fill>
      {canEdit && (
        <Button
          plain
          margin="xsmall"
          fill="vertical"
          icon={<FontAwesomeIcon icon={faMinusSquare} />}
          color={props.card.value === 0 ? "light-6" : "brand"}
          onClick={() => onClickSegment(-1)}
        />
      )}
      <Box direction="row" fill gap="xxsmall" justify="stretch">
        {segments}
      </Box>
    </Box>
  );
}
