export type CardState =
  | ArticleCardState
  | ClockCardState
  | RollTableCardState
  | ImageCardState
  | DiceCardState;

export type ArticleCardState = BaseCardState & {
  type: "article";
  content: string;
};

export type ClockCardState = BaseCardState & {
  type: "clock";
  max: number;
  value: number;
};

export type RollTableCardState = BaseCardState & {
  type: "roll-table";
  entries: RollTableEntry[];
  lastRoll: number | null;
};

export type RollTableEntry = {
  weight: number;
  content: string;
};

export type ImageCardState = BaseCardState & {
  type: "image";
  imageUrl: string;
};

export type DiceCardState = BaseCardState & {
  type: "dice";
  history: DiceRoll[];
};

export type DiceRoll = {
  expression: string;
  result: string;
};

type BaseCardState = {
  cardId: string;
  title: string;
};
