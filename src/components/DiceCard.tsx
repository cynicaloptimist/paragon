import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dice } from "dice-typescript";

import { DiceCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { Button, Box, TextInput } from "grommet";
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

  const [diceInput, setDiceInput] = useState("");
  const [lookback, setLookback] = useState(0);

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
      <TextInput
        value={diceInput}
        onChange={(e) => setDiceInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            rollDice(diceInput);
            setDiceInput("");
          }
          if (e.key === "ArrowUp" && lookback < card.history.length) {
            setDiceInput(
              card.history[card.history.length - (lookback + 1)].expression
            );
            setLookback(lookback + 1);
          }
          if (e.key === "ArrowDown" && lookback - 1 > 0) {
            setDiceInput(
              card.history[card.history.length - (lookback - 1)].expression
            );
            setLookback(lookback - 1);
          }
        }}
      />
    </BaseCard>
  );
}
