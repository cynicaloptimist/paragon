import GridLayout from "react-grid-layout";

export type AppState = {
  openCardIds: string[];
  cardsById: CardsState;
  layouts: GridLayout.Layout[];
};

export type CardsState = { [cardId: string]: CardState };

export const GetInitialState = (): AppState => ({
  openCardIds: [],
  cardsById: {},
  layouts: [],
});

export type CardState = ArticleCardState | ClockCardState;

export type ArticleCardState = BaseCardState & {
  type: "article";
  content: string;
};

export type ClockCardState = BaseCardState & {
  type: "clock";
  max: number;
  current: number;
};

type BaseCardState = {
  cardId: string;
  title: string;
};
