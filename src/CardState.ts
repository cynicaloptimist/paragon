export type CardState = ArticleCardState | ClockCardState | RollTableCardState | ImageCardState;

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
}

type BaseCardState = {
  cardId: string;
  title: string;
};
