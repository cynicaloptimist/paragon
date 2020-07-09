import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dice } from "dice-typescript";

import { DiceCardState, DiceRoll } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { Button, Box, TextInput, Text } from "grommet";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardActions } from "../actions/Actions";
import { faRedo, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
          total: result.total,
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
      cardState={card}
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
      <Box overflow={{ vertical: "auto" }} flex justify="start">
        {card.history.map((roll, index) => (
          <DiceRollRow key={index} roll={roll} rollDice={rollDice} />
        ))}
        <div ref={scrollBottom} />
      </Box>
      <TextInput
        value={diceInput}
        onChange={(e) => setDiceInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && diceInput.length > 0) {
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

function DiceRollRow(props: {
  roll: DiceRoll;
  rollDice: (expression: string) => void;
}) {
  return (
    <Box flex={false} direction="row" border="top">
      <Box fill justify="center">
        <Text>
          {props.roll.expression}
          <FontAwesomeIcon
            icon={faArrowRight}
            size="xs"
            style={{ padding: "0 5px 1px" }}
          />
          {props.roll.result}
          {" = "}
          <strong>{props.roll.total}</strong>
        </Text>
      </Box>
      <Button
        margin="xxsmall"
        color="light-6"
        hoverIndicator={{ color: "auto" }}
        onClick={() => props.rollDice(props.roll.expression)}
        icon={<FontAwesomeIcon icon={faRedo} size="xs" />}
      />
    </Box>
  );
}