import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Text, TextArea } from "grommet";
import * as React from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { ClockCardState, PlayerViewPermission } from "../../../state/CardState";
import { useThrottledTrailing } from "../../hooks/useThrottled";
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
    segments.push(
      <DetailRow
        key={props.card.cardId + "_" + i}
        detailIndex={i}
        card={props.card}
      />
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
        <Box direction="row" align="center">
          <Button
            plain
            margin={{ vertical: "xsmall" }}
            style={{ textAlign: "center", width: VERTICAL_CLOCK_SEGMENT_WIDTH }}
            icon={<FontAwesomeIcon icon={faMinusSquare} />}
            color={props.card.value === 0 ? "light-6" : "brand"}
            onClick={() => onClickSegment(-1)}
          />
          <Text style={{ fontStyle: "italic" }} margin="small">
            Detail
          </Text>
        </Box>
      )}
      <Box direction="column" fill gap="xxsmall" justify="stretch">
        {segments}
      </Box>
    </Box>
  );
}

function DetailRow(props: { detailIndex: number; card: ClockCardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const viewType = React.useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;
  const onClickSegment = useOnClickSegment(props);

  const onDetailSave = React.useCallback(
    (changeEvent: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(
        CardActions.SetClockDetail({
          cardId: props.card.cardId,
          detailIndex: props.detailIndex,
          detail: changeEvent.target.value,
        })
      );
    },
    [dispatch, props.card.cardId, props.detailIndex]
  );
  const onDetailSaveThrottled = useThrottledTrailing(onDetailSave, 200);

  const i = props.detailIndex;
  const color = i < props.card.value ? "brand" : "light-6";

  return (
    <Box direction="row" flex="grow">
      <Box
        key={i}
        width={VERTICAL_CLOCK_SEGMENT_WIDTH}
        flex={false}
        hoverIndicator={canEdit && { color: "brand-2" }}
        background={color}
        onClick={canEdit ? () => onClickSegment(i) : undefined}
      />
      <Box border={{ color: color, size: "medium" }} fill>
        <TextArea
          resize="vertical"
          defaultValue={props.card.details?.[i]}
          onChange={(changeEvent) => {
            return onDetailSaveThrottled(changeEvent);
          }}
        />
      </Box>
    </Box>
  );
}
