export type AppState = {
  openCardIds: string[];
};

export const GetInitialState = (): AppState => ({
  openCardIds: []
});
