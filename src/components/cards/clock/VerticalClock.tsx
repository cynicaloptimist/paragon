import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import * as React from "react";
import { ClockCardState, PlayerViewPermission } from "../../../state/CardState";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { useOnClickSegment } from "./useOnClickSegment";

const VERTICAL_CLOCK_SEGMENT_WIDTH = "50px";

export function VerticalClock(props: { card: ClockCardState }) {
  const viewType = React.useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  const onClickSegment = useOnClickSegment(props);
  let segments = [];
  for (let i = 0; i < props.card.max; i++) {
    const color = i < props.card.value ? "brand" : "light-6";
    segments.push(
      <Box direction="row" flex="grow">
        <Box
          key={i}
          width={VERTICAL_CLOCK_SEGMENT_WIDTH}
          flex="grow"
          hoverIndicator={canEdit && { color: "brand-2" }}
          background={color}
          onClick={canEdit ? () => onClickSegment(i) : undefined}
        />
        <Box margin="small">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Box>
      </Box>
    );
  }
  return (
    <Box
      direction="column"
      align="flex-start"
      fill="vertical"
      overflow={{ vertical: "auto" }}
    >
      {canEdit && (
        <Button
          plain
          margin={{ vertical: "xsmall" }}
          style={{ textAlign: "center", width: VERTICAL_CLOCK_SEGMENT_WIDTH }}
          icon={<FontAwesomeIcon icon={faMinusSquare} />}
          color={props.card.value === 0 ? "light-6" : "brand"}
          onClick={() => onClickSegment(-1)}
        />
      )}
      <Box direction="column" fill gap="xxsmall" justify="stretch">
        {segments}
      </Box>
    </Box>
  );
}
