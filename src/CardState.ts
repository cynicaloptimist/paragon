export type CardState = ArticleCardState | ClockCardState | RollTableCardState;

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
  entries: RollTableEntry [];
};

export type RollTableEntry = {
  weight: number;
  content: string;
};

type BaseCardState = {
  cardId: string;
  title: string;
};
