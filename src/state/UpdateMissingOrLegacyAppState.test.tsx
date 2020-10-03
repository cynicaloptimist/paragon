import { EmptyState } from "./AppState";
import {
  LegacyAppState,
  UpdateMissingOrLegacyAppState
} from "./LegacyAppState";

test("updates legacy empty state", () => {
  const storedState: LegacyAppState = {
    openCardIds: [],
    cardsById: {},
    layouts: [],
    cardLibraryVisibility: false,
    layoutCompaction: "free",
    playerViewId: "",
  };
  const updatedState = UpdateMissingOrLegacyAppState(storedState);

  expect(updatedState).toEqual(EmptyState());
});
