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

export type CardState = ArticleCardState;

export type ArticleCardState = {
  cardId: string;
  content: string;
};
