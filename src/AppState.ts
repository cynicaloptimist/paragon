export type AppState = {
  openCardsById: string[];
};

export const GetInitialState = (): AppState => ({
  openCardsById: []
});
