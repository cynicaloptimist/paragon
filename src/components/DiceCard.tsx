import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Dice } from "dice-typescript";

import { DiceCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { Button, Box } from "grommet";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardActions } from "../actions/Actions";

const dice = new Dice();

export function DiceCard(props: { card: DiceCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const rollDice = useCallback(
    (expression) => {
      const result = dice.roll(expression);
      dispatch(
        CardActions.RollDiceExpression({
          cardId: card.cardId,
          expression,
          result: result.renderedExpression,
        })
      );
    },
    [card.cardId, dispatch]
  );

  const quickDie = (dieSize: string) => (
    <Button margin="xxsmall" onClick={() => rollDice("1" + dieSize)}>
      {dieSize}
    </Button>
  );

  const scrollBottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [card.history]);

  return (
    <BaseCard
      cardId={card.cardId}
      commands={
        <>
          {quickDie("d2")}
          {quickDie("d4")}
          {quickDie("d6")}
          {quickDie("d8")}
          {quickDie("d10")}
          {quickDie("d12")}
          {quickDie("d20")}
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
        <div ref={scrollBottom} />
      </Box>
    </BaseCard>
  );
}
