import { faCheck, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  FormField,
  TextInput,
  ThemeContext,
  ThemeType
} from "grommet";
import { normalizeColor } from "grommet/utils";
import * as React from "react";
import { PieChart } from "react-minimal-pie-chart";
import { Data as PieChartData } from "react-minimal-pie-chart/types/commonTypes";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { ClockCardState, PlayerViewPermission } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { PlayerViewContext } from "./PlayerViewContext";

export function ClockCard(props: { card: ClockCardState }) {
  const [isConfigurable, setConfigurable] = React.useState(false);

  let innerComponent = <HorizontalClock card={props.card} />;

  if (isConfigurable) {
    innerComponent = (
      <ConfigureClock card={props.card} setConfigurable={setConfigurable} />
    );
  } else if (props.card.displayType === "radial") {
    innerComponent = <ClockFace card={props.card} />;
  }

  return (
    <BaseCard
      cardState={props.card}
      commands={
        <Button
          aria-label="toggle-edit-mode"
          onClick={() => setConfigurable(!isConfigurable)}
          icon={
            <FontAwesomeIcon
              size="xs"
              icon={isConfigurable ? faCheck : faEdit}
            />
          }
        />
      }
    >
      {innerComponent}
    </BaseCard>
  );
}

function ConfigureClock(props: {
  card: ClockCardState;
  setConfigurable: (configurable: boolean) => void;
}) {
  const { dispatch } = React.useContext(ReducerContext);
  const { card, setConfigurable } = props;
  const setCardValue = React.useCallback(
    (value: number) =>
      dispatch(
        CardActions.SetClockValue({
          cardId: card.cardId,
          value,
        })
      ),
    [card.cardId, dispatch]
  );

  const setCardMax = React.useCallback(
    (max: number) =>
      dispatch(
        CardActions.SetClockMax({
          cardId: card.cardId,
          max,
        })
      ),
    [card.cardId, dispatch]
  );

  const setCardDisplayType = React.useCallback(
    (displayType: "horizontal" | "radial") => {
      dispatch(
        CardActions.SetClockDisplayType({
          cardId: card.cardId,
          displayType,
        })
      );
      setConfigurable(false);
    },
    [card.cardId, dispatch, setConfigurable]
  );

  return (
    <Box direction="column">
      <Box direction="row" align="center">
        <FormField label="Current">
          <TextInput
            type="number"
            defaultValue={card.value}
            onBlur={(e) => setCardValue(parseInt(e.target.value))}
          />
        </FormField>
        <FormField label="Maximum">
          <TextInput
            type="number"
            defaultValue={card.max}
            onBlur={(e) => setCardMax(parseInt(e.target.value))}
          />
        </FormField>
      </Box>
      <Box direction="row" align="center">
        <Button
          label="Horizontal"
          active={card.displayType === "horizontal"}
          onClick={() => setCardDisplayType("horizontal")}
        />
        <Button
          label="Radial"
          active={card.displayType === "radial"}
          onClick={() => setCardDisplayType("radial")}
        />
      </Box>
    </Box>
  );
}

function ClockFace(props: { card: ClockCardState }) {
  const onClickSegment = useOnClickSegment(props);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);
  const isGmView = React.useContext(PlayerViewContext) === null;
  const canEdit =
    isGmView ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  const theme: ThemeType = React.useContext(ThemeContext);
  const themeColor = normalizeColor(
    theme.global?.colors?.brand || "brand",
    theme
  );
  const offColor = normalizeColor(
    theme.global?.colors?.["light-6"] || "light-6",
    theme
  );
  const hoverColor = normalizeColor(
    theme.global?.colors?.["brand-2"] || "brand-2",
    theme
  );
  let segments: PieChartData = [];
  for (let i = 0; i < props.card.max; i++) {
    let color = offColor;
    if (i < props.card.value) {
      color = themeColor;
    }
    if (i === hoveredIndex) {
      color = hoverColor;
    }

    segments.push({
      color,
      value: 1,
    });
  }
  return (
    <PieChart
      data={segments}
      onClick={canEdit ? (e, index) => onClickSegment(index) : undefined}
      onMouseOver={canEdit ? (e, index) => setHoveredIndex(index) : undefined}
      onMouseOut={() => setHoveredIndex(-1)}
      startAngle={-90}
      segmentsShift={2}
      radius={48}
    />
  );
}

function HorizontalClock(props: { card: ClockCardState }) {
  const isGmView = React.useContext(PlayerViewContext) === null;
  const canEdit =
    isGmView ||
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
          icon={<FontAwesomeIcon icon={faTimes} />}
          onClick={() => onClickSegment(-1)}
        />
      )}
      <Box direction="row" fill gap="xxsmall" justify="stretch">
        {segments}
      </Box>
    </Box>
  );
}

function useOnClickSegment(props: { card: ClockCardState }) {
  const { dispatch } = React.useContext(ReducerContext);

  const segmentClickHandler = React.useCallback(
    (clickedIndex: number) => {
      let value = clickedIndex + 1;
      if (
        props.card.displayType === "radial" &&
        props.card.value === 1 &&
        value === 1
      ) {
        value = 0;
      }

      dispatch(
        CardActions.SetClockValue({
          cardId: props.card.cardId,
          value,
        })
      );
    },
    [props.card.cardId, props.card.value, props.card.displayType, dispatch]
  );
  return segmentClickHandler;
}
