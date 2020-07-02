import * as React from "react";
import { ReducerContext } from "../reducers/ReducerContext";
import { BaseCard } from "./BaseCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Box, TextInput, Text, FormField } from "grommet";
import { ClockCardState } from "../state/CardState";
import { CardActions } from "../actions/Actions";

export function ClockCard(props: { card: ClockCardState }) {
  const [isConfigurable, setConfigurable] = React.useState(false);

  return (
    <BaseCard
      cardId={props.card.cardId}
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
      {isConfigurable ? (
        <ConfigureClock card={props.card} />
      ) : (
        <Clock card={props.card} />
      )}
    </BaseCard>
  );
}

function ConfigureClock(props: { card: ClockCardState }) {
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

  return (
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
  );
}

function Clock(props: { card: ClockCardState }) {
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
