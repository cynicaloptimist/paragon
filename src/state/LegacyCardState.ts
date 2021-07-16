import { CardState, PlayerViewPermission, RollTableEntry } from "./CardState";

type LegacyBaseCardState = {
  cardId: string;
  title: string;
  playerViewPermission: PlayerViewPermission;
  path?: string;
};

type LegacyRollTableCardState = LegacyBaseCardState & {
  type: "roll-table";
  entries: RollTableEntry[];
  lastRoll: number | null;
};

export type LegacyCardState = CardState | LegacyRollTableCardState;

export function UpdateCardState(legacyCard: LegacyCardState): CardState {
  if (legacyCard.type === "roll-table") {
    return {
      ...legacyCard,
      type: "roll-table-h",
      rollHistory: legacyCard.lastRoll ? [legacyCard.lastRoll] : [],
    };
  } else {
    return legacyCard as CardState;
  }
}
