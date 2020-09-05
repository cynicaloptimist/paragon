import GridLayout from "react-grid-layout";
import { AppState, CardsState } from "./AppState";
import { GetInitialState } from "./GetInitialState";

export type LegacyAppState = {
  openCardIds: string[];
  cardsById: CardsState;
  layouts: GridLayout.Layout[];
  cardLibraryVisibility: boolean;
  layoutCompaction: "free" | "compact";
  playerViewId: string;
};

export function UpdateMissingOrLegacyAppState(
  storedState: LegacyAppState | {}
): AppState {
  const initialState = GetInitialState();
  return {
    ...initialState,
    ...storedState,
  };
}
