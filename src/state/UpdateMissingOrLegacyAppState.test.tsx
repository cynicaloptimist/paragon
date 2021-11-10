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
        name: "Dashboard 1",
        layoutCompaction: "free",
        layoutPushCards: "none",
        layouts: [],
        openCardIds: [],
      },
    },
  };

  expect(updatedState).toMatchObject(expectedState);
});

test("updates legacy dashboard state", () => {
  const storedState: LegacyAppState = {
    ...EmptyState(),
    activeDashboardId: "playerViewId",
    dashboardsById: {
      playerViewId: {
        name: "Dashboard 1",
        layoutCompaction: "free",
        layouts: [],
        openCardIds: [],
      },
    },
  };
  const updatedState = UpdateMissingOrLegacyAppState(storedState);

  const expectedState: AppState = {
    ...EmptyState(),
    activeDashboardId: "playerViewId",
    dashboardsById: {
      playerViewId: {
        name: "Dashboard 1",
        layoutCompaction: "free",
        layoutPushCards: "none",
        layouts: [],
        openCardIds: [],
      },
    },
  };

  expect(updatedState).toMatchObject(expectedState);
});