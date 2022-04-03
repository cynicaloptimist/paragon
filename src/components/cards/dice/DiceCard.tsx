import { Dice } from "dice-typescript";
import { Box, Button, TextInput } from "grommet";
import { useCallback, useContext, useRef, useState } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import {
  DiceCardState,
  DiceRoll,
  PlayerViewPermission,
} from "../../../state/CardState";
import { BaseCard } from "../BaseCard";
import { useScrollTo } from "../../hooks/useScrollTo";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { DiceRollRow } from "./DiceRollRow";
import { PlayerViewUserContext } from "../../PlayerViewUserContext";

const dice = new Dice();

const defaultQuickRolls = ["d2", "d4", "d6", "d8", "d10", "d12", "d20", "d100"];

export function DiceCard(props: { card: DiceCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

  const playerViewUser = useContext(PlayerViewUserContext);

  const rollDice = useCallback(
    (expression: string) => {
      const result = dice.roll(expression);
      dispatch(
        CardActions.RollDiceExpression({
          cardId: card.cardId,
          expression,
          result: result.renderedExpression,
          total: result.total,
          userName: playerViewUser.name || undefined,
        })
      );
    },
    [card.cardId, dispatch, playerViewUser.name]
  );

  const quickRollButton = (quickRoll: string) => (
    <Button margin="xxsmall" onClick={() => rollDice(quickRoll)}>
      {quickRoll}
    </Button>
  );

  const cardHistory = card.history || [];
  const scrollBottom = useScrollTo(cardHistory);

  const nameInputVisible =
    viewType === ViewType.Player && canEdit && playerViewUser.name === null;

  return (
    <BaseCard
      cardState={card}
      commands={defaultQuickRolls.map(quickRollButton)}
    >
      <Box overflow={{ vertical: "auto" }} flex justify="start">
        {cardHistory.map((roll, index) => (
          <DiceRollRow key={index} roll={roll} rollDice={rollDice} />
        ))}
        <div ref={scrollBottom} />
      </Box>
      {nameInputVisible && (
        <TextInput
          placeholder="Enter a name to roll dice"
          onKeyDown={(keyboardEvent) => {
            if (keyboardEvent.key !== "Enter") {
              return;
            }

            const target = keyboardEvent.target as HTMLInputElement;
            if (target.value.length) {
              playerViewUser.setName(target.value);
            }
          }}
        />
      )}
      {!nameInputVisible && canEdit && (
        <DiceTextInput rollDice={rollDice} cardHistory={cardHistory} />
      )}
    </BaseCard>
  );
}

function DiceTextInput(props: {
  rollDice: (expression: string) => void;
  cardHistory: DiceRoll[];
}) {
  const { rollDice, cardHistory } = props;
  const [lookback, setLookback] = useState(0);
  const diceInputRef = useRef<HTMLInputElement>(null);

  return (
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
  );
}
