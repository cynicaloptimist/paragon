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

export type CardState = {
  cardId: string;
  title: string;

} &  ArticleCardState;

export type ArticleCardState = {
  type: "article";
  content: string;
};

export type ClockCardState = {
  type: "clock";
  max: number;
  current: number;
}
