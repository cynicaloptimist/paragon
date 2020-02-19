export type AppState = {
  cardCount: number;
};

export const GetInitialState = (): AppState => ({
  cardCount: 1
});
