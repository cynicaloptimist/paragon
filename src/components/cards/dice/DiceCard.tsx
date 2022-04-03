import { Dice } from "dice-typescript";
import { Box, Button, TextArea, TextInput } from "grommet";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faGears, faTimes } from "@fortawesome/free-solid-svg-icons";

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

  const [configuringQuickRolls, setConfiguringQuickRolls] = useState(false);
  const quickRolls = card.quickRolls ?? defaultQuickRolls;
  const quickRollButtons = quickRolls.map((quickRoll: string) => (
    <Button margin="xxsmall" onClick={() => rollDice(quickRoll)}>
      {quickRoll}
    </Button>
  ));
  const commands = [
    ...quickRollButtons,
    <Button
      icon={<FontAwesomeIcon icon={faGears} />}
      onClick={() => setConfiguringQuickRolls(true)}
    />,
  ];

  const cardHistory = card.history || [];
  const scrollBottom = useScrollTo(cardHistory);

  const nameInputVisible =
    viewType === ViewType.Player && canEdit && playerViewUser.name === null;

  if (configuringQuickRolls) {
    return (
      <QuickRollsInput
        card={card}
        done={() => setConfiguringQuickRolls(false)}
      />
    );
  }
  return (
    <BaseCard cardState={card} commands={commands}>
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

function QuickRollsInput(props: { card: DiceCardState; done: () => void }) {
  const { dispatch } = useContext(ReducerContext);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const quickRolls = props.card.quickRolls ?? defaultQuickRolls;
  const inputDefaultValue = quickRolls.join("\n");
  return (
    <BaseCard
      cardState={props.card}
      commands={[
        <Button
          icon={<FontAwesomeIcon icon={faCheck} />}
          onClick={() => {
            if (!inputRef.current) {
              return;
            }
            const newQuickRolls = inputRef.current.value.split("\n");
            dispatch(
              CardActions.SetQuickRolls({
                cardId: props.card.cardId,
                quickRolls: newQuickRolls,
              })
            );
            props.done();
          }}
        />,
      ]}
    >
      <TextArea fill ref={inputRef} defaultValue={inputDefaultValue} />
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
