import { AppState, EmptyState } from "./AppState";
import { GetInitialState } from "./GetInitialState";
import {
  LegacyAppState,
  UpdateMissingOrLegacyAppState,
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
    dashboardsById: {
      playerViewId: {
        name: "Dashboard 1",
        layoutCompaction: "free",
        layoutPushCards: "none",
        layoutsBySize: { xxl: [] },
        openCardIds: [],
      },
    },
    appSettings: {
      cardTypesInMenu: GetInitialState().appSettings.cardTypesInMenu,
      templateIdsInMenu: GetInitialState().appSettings.templateIdsInMenu,
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
        layouts: [{ i: "cardId", x: 4, y: 4, w: 5, h: 5 }],
        openCardIds: [],
      },
    },
  };
  const updatedState = UpdateMissingOrLegacyAppState(storedState);

  const expectedState: AppState = {
    ...EmptyState(),
    dashboardsById: {
      playerViewId: {
        name: "Dashboard 1",
        layoutCompaction: "free",
        layoutPushCards: "none",
        layoutsBySize: { xxl: [{ i: "cardId", x: 4, y: 4, w: 5, h: 5 }] },
        openCardIds: [],
      },
    },
  };

  expect(updatedState).toMatchObject(expectedState);
});
