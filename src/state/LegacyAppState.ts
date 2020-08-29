import GridLayout from "react-grid-layout";
import { AppState, CardsState, GetInitialState } from "./AppState";

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
