import { TextInput } from "grommet";
import { useRef, useState } from "react";
import { DiceRoll } from "../../../state/CardState";

export function DiceTextInput(props: {
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
          const historyEntry = cardHistory[cardHistory.length - (lookback + 1)];
          if (historyEntry) {
            input.value = historyEntry.expression;
            setLookback(lookback + 1);
          }
        }
        if (e.key === "ArrowDown" && lookback - 1 > 0) {
          const historyEntry = cardHistory[cardHistory.length - (lookback - 1)];
          if (historyEntry) {
            input.value = historyEntry.expression;
            setLookback(lookback - 1);
          }
        }
      }}
    />
  );
}
