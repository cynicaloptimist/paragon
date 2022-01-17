import { Dice } from "dice-typescript";
import { Box, Button, TextInput } from "grommet";
import { useCallback, useContext, useRef, useState } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { DiceCardState, PlayerViewPermission } from "../../../state/CardState";
import { BaseCard } from "../BaseCard";
import { useScrollTo } from "../../hooks/useScrollTo";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { DiceRollRow } from "./DiceRollRow";

const dice = new Dice();

export function DiceCard(props: { card: DiceCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

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

  const cardHistory = card.history || [];
  const scrollBottom = useScrollTo(cardHistory);

  const diceInputRef = useRef<HTMLInputElement>(null);
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
          {quickDie("d100")}
        </>
      }
    >
      <Box overflow={{ vertical: "auto" }} flex justify="start">
        {cardHistory.map((roll, index) => (
          <DiceRollRow key={index} roll={roll} rollDice={rollDice} />
        ))}
        <div ref={scrollBottom} />
      </Box>
      {canEdit && (
        <TextInput
          ref={diceInputRef}
          onKeyDown={(e) => {
            if (!diceInputRef.current) {
              return;
            }
            const input = diceInputRef.current;
            if (e.key === "Enter" && input.value.length > 0) {
              rollDice(input.value);
              input.value = "";
              setLookback(0);
            }
            if (e.key === "ArrowUp" && lookback < cardHistory.length) {
              input.value =
                cardHistory[cardHistory.length - (lookback + 1)].expression;

              setLookback(lookback + 1);
            }
            if (e.key === "ArrowDown" && lookback - 1 > 0) {
              input.value =
                cardHistory[cardHistory.length - (lookback - 1)].expression;

              setLookback(lookback - 1);
            }
          }}
        />
      )}
    </BaseCard>
  );
}
