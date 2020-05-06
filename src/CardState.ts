export type CardState = ArticleCardState | ClockCardState;

export type ArticleCardState = BaseCardState & {
  type: "article";
  content: string;
};

export type ClockCardState = BaseCardState & {
  type: "clock";
  max: number;
  value: number;
};

type BaseCardState = {
  cardId: string;
  title: string;
};
