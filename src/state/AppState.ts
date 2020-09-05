import GridLayout from "react-grid-layout";
import { CardState } from "./CardState";

export type AppState = {
  openCardIds: string[];
  cardsById: CardsState;
  layouts: GridLayout.Layout[];
  cardLibraryVisibility: boolean;
  layoutCompaction: "free" | "compact";
  playerViewId: string;
};

export type CardsState = { [cardId: string]: CardState };

export const EmptyState = (): AppState => ({
  openCardIds: [],
  cardsById: {},
  layouts: [],
  cardLibraryVisibility: false,
  layoutCompaction: "free",
  playerViewId: "",
});
