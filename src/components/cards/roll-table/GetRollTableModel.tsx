import { RollTableCardState } from "../../../state/CardState";

export function GetRollTableModel(
  card: RollTableCardState,
  rollResult: number
): RollTableModel {
  let runningTotal = 0;
  const cardEntries = card.entries || [];
  const entries = cardEntries.map((entry) => {
    runningTotal += entry.weight;
    const diceRangeFloor = runningTotal - entry.weight + 1;
    const diceRangeCeiling = runningTotal;

    const diceRange =
      entry.weight === 1
        ? diceRangeCeiling.toString()
        : `${diceRangeFloor} - ${diceRangeCeiling}`;

    return {
      ...entry,
      diceRangeFloor,
      diceRangeCeiling,
      diceRange,
      isRolled: rollResult >= diceRangeFloor && rollResult <= diceRangeCeiling,
    };
  });
  return {
    cardId: card.cardId,
    cardTitle: card.title,
    dieSize: runningTotal,
    rollResult,
    entries,
  };
}
export type RollTableModel = {
  cardId: string;
  cardTitle: string;
  dieSize: number;
  rollResult: number;
  entries: {
    content: string;
    weight: number;
    diceRangeFloor: number;
    diceRangeCeiling: number;
    diceRange: string;
    isRolled: boolean;
  }[];
};
