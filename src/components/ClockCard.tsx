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
import { CardActions } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";
import { ClockCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";

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
  const setCardValue = React.useCallback(
    (value: number) =>
      dispatch(
        CardActions.SetClockValue({
          cardId: props.card.cardId,
          value,
        })
      ),
    [props.card.cardId, dispatch]
  );

  const setCardMax = React.useCallback(
    (max: number) =>
      dispatch(
        CardActions.SetClockMax({
          cardId: props.card.cardId,
          max,
        })
      ),
    [props.card.cardId, dispatch]
  );

  const setCardDisplayType = React.useCallback(
    (displayType: "horizontal" | "radial") =>
      dispatch(
        CardActions.SetClockDisplayType({
          cardId: props.card.cardId,
          displayType,
        })
      ),
    [props.card.cardId, dispatch]
  );

  return (
    <Box direction="column">
      <Box direction="row" align="center">
        <FormField label="Current">
          <TextInput
            type="number"
            defaultValue={props.card.value}
            onBlur={(e) => setCardValue(parseInt(e.target.value))}
          />
        </FormField>
        <FormField label="Maximum">
          <TextInput
            type="number"
            defaultValue={props.card.max}
            onBlur={(e) => setCardMax(parseInt(e.target.value))}
          />
        </FormField>
      </Box>
      <Box direction="row" align="center">
        <Button
          label="Horizontal"
          active={props.card.displayType === "horizontal"}
          onClick={() => setCardDisplayType("horizontal")}
        />
        <Button
          label="Radial"
          active={props.card.displayType === "radial"}
          onClick={() => setCardDisplayType("radial")}
        />
      </Box>
    </Box>
  );
}

function ClockFace(props: { card: ClockCardState }) {
  const setCardValue = useSetCardValue(props);
  const theme: ThemeType = React.useContext(ThemeContext);
  const themeColor = normalizeColor(
    theme.global?.colors?.brand || "brand",
    theme
  );
  const offColor = normalizeColor(
    theme.global?.colors?.["light-6"] || "light-6",
    theme
  );
  let segments: PieChartData = [];
  for (let i = 0; i < props.card.max; i++) {
    const color = i < props.card.value ? themeColor : offColor;
    segments.push({
      color,
      value: 1,
    });
  }
  return (
    <PieChart
      data={segments}
      onClick={(e, index) => setCardValue(index + 1)}
      startAngle={-90}
      segmentsShift={2}
      radius={48}
    />
  );
}

function HorizontalClock(props: { card: ClockCardState }) {
  const setCardValue = useSetCardValue(props);

  let segments = [];
  for (let i = 0; i < props.card.max; i++) {
    const color = i < props.card.value ? "brand" : "light-6";
    segments.push(
      <Box
        key={i}
        fill
        hoverIndicator={{ color: "brand-2" }}
        background={color}
        onClick={() => setCardValue(i + 1)}
      />
    );
  }
  return (
    <Box direction="row" align="center" fill>
      <Button
        plain
        margin="xsmall"
        fill="vertical"
        icon={<FontAwesomeIcon icon={faTimes} />}
        onClick={() => setCardValue(0)}
      />
      <Box direction="row" fill gap="xxsmall" justify="stretch">
        {segments}
      </Box>
    </Box>
  );
}

function useSetCardValue(props: { card: ClockCardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const setCardValue = React.useCallback(
    (value: number) =>
      dispatch(
        CardActions.SetClockValue({
          cardId: props.card.cardId,
          value,
        })
      ),
    [props.card.cardId, dispatch]
  );
  return setCardValue;
}
