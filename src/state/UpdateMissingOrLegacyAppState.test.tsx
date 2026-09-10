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

test("migrates root-level layouts into the responsive xxl layout", () => {
  const legacyLayout = {
    i: "cardId",
    x: 4,
    y: 3,
    w: 8,
    h: 6,
    minW: 4,
    minH: 3,
  };
  const storedState: LegacyAppState = {
    cardsById: {},
    playerViewId: "playerViewId",
    openCardIds: [legacyLayout.i],
    layouts: [legacyLayout],
    layoutCompaction: "compact",
  };

  const updatedState = UpdateMissingOrLegacyAppState(storedState);

  expect(updatedState.dashboardsById.playerViewId).toMatchObject({
    openCardIds: [legacyLayout.i],
    layoutsBySize: { xxl: [legacyLayout] },
    layoutCompaction: "compact",
    layoutPushCards: "none",
  });
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
