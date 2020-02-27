export type AppState = {
  openCardIds: string[];
  cardsById: { [cardId: string]: CardState };
};

export const GetInitialState = (): AppState => ({
  openCardIds: [],
  cardsById: {}
});

export type CardState = ArticleCardState;

export type ArticleCardState = {
  cardId: string;
  content: string;
};
