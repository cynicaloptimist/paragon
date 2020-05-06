import * as React from "react";
import { ReducerContext } from "./ReducerContext";
import { BaseCard } from "./BaseCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button, Box } from "grommet";
import { ClockCardState } from "./CardState";
import { Actions } from "./Actions";

export function ClockCard(props: { card: ClockCardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const { card } = props;

  const [isConfigurable, setConfigurable] = React.useState(false);

  const setCardValue = React.useCallback(
    (value: number) =>
      dispatch(
        Actions.SetClockValue({
          cardId: props.card.cardId,
          value,
        })
      ),
    [props.card.cardId, dispatch]
  );

  return (
    <BaseCard
      cardId={card.cardId}
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
        "Configure"
      ) : (
        <Clock value={card.value} max={card.max} onChange={setCardValue} />
      )}
    </BaseCard>
  );
}

function Clock(props: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  let segments = [];
  for (let i = 0; i < props.max; i++) {
    const color = i < props.value ? "brand" : "neutral-3";
    segments.push(
      <Box
        key={i}
        flex="grow"
        background={color}
        onClick={() => props.onChange(i + 1)}
      />
    );
  }
  return (
    <Box direction="row" height="xxsmall" gap="xxsmall" justify="stretch">
      {segments}
    </Box>
  );
}
