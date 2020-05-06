import * as React from "react";
import { ReducerContext } from "./ReducerContext";
import { BaseCard } from "./BaseCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button, RangeInput } from "grommet";
import { ClockCardState } from "./CardState";
import { Actions } from "./Actions";

export function ClockCard(props: { card: ClockCardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const { card } = props;

  const [isConfigurable, setConfigurable] = React.useState(false);

  const setCardValue = React.useCallback(
    (event: React.ChangeEvent<any>) =>
      dispatch(
        Actions.SetClockValue({
          cardId: props.card.cardId,
          value: event.target.value,
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
        <RangeInput
          min={0}
          max={card.max}
          value={card.value}
          onChange={setCardValue}
        />
      )}
    </BaseCard>
  );
}
