import React, { useCallback, useContext } from "react";
import { Dice } from "dice-typescript";

import { DiceCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { Button, Box } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardActions } from "../actions/Actions";

const dice = new Dice();

export function DiceCard(props: { card: DiceCardState }) {
  const { dispatch } = useContext(ReducerContext);

  const { card } = props;
  const rollDice = useCallback(() => {
    const expression = "1d6";
    const result = dice.roll(expression);
    dispatch(
      CardActions.RollDiceExpression({
        cardId: card.cardId,
        expression,
        result: result.renderedExpression,
      })
    );
  }, [card.cardId, dispatch]);

  return (
    <BaseCard
      cardId={card.cardId}
      commands={
        <>
          <Button
            icon={
              <FontAwesomeIcon size="xs" icon={faDice} onClick={rollDice} />
            }
          />
        </>
      }
    >
      <Box overflow={{ vertical: "auto" }}>
        {card.history.map((roll, index) => (
          <Box flex="grow" key={index}>
            {roll.expression}
            {" => "}
            {roll.result}
          </Box>
        ))}
      </Box>
    </BaseCard>
  );
}
