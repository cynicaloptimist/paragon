import GridLayout from "react-grid-layout";
import { CardState } from "./CardState";

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
