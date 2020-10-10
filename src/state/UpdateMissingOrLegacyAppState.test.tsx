import { AppState, EmptyState } from "./AppState";
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
    playerViewId: "playerViewId",
  };
  const updatedState = UpdateMissingOrLegacyAppState(storedState);

  const expectedState: AppState = {
    ...EmptyState(),
    activeDashboardId: "playerViewId",
    dashboardsById: {
      playerViewId: {
        layoutCompaction: "free",
        layouts: [],
        openCardIds: [],
      },
    },
  };

  expect(updatedState).toEqual(expectedState);
});
