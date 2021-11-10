import _ from "lodash";
import GridLayout from "react-grid-layout";
import { randomString } from "../randomString";
import {
  AppState,
  CardsState,
  DashboardState,
  EmptyState,
  UserState,
} from "./AppState";
import { GetInitialState } from "./GetInitialState";
import { LegacyCardState, UpdateCardState } from "./LegacyCardState";

export type LegacyAppState = {
  //new
  dashboardsById?: Record<string, LegacyDashboardState>;
  activeDashboardId?: string | null;
  librarySidebarMode?: "hidden" | "cards" | "dashboards";
  user?: UserState;
  layoutPushCards?: "none" | "preventcollision";

  //current
  cardsById: LegacyCardsState;

  //legacy
  cardLibraryVisibility?: boolean;
  playerViewId?: string;
  openCardIds?: string[];
  layouts?: GridLayout.Layout[];
  layoutCompaction?: "free" | "compact";
};

type LegacyDashboardState = {
  name: string;
  openCardIds?: string[];
  layouts?: GridLayout.Layout[];
  layoutCompaction: "free" | "compact";
  layoutPushCards?: "none" | "preventcollision";
};

type LegacyCardsState = Record<string, LegacyCardState>;

export function UpdateMissingOrLegacyAppState(
  storedState: LegacyAppState | null
): AppState {
  if (!storedState) {
    return GetInitialState();
  }

  const convertedCards: CardsState = {};

  for (const cardId of Object.keys(storedState.cardsById)) {
    convertedCards[cardId] = UpdateCardState(storedState.cardsById[cardId]);
  }

  const appState: AppState = {
    ...EmptyState(),
    ...storedState,
    cardsById: convertedCards,
    dashboardsById: {},
  };

  appState.librarySidebarMode =
    storedState.librarySidebarMode ??
    (storedState.cardLibraryVisibility ? "cards" : "hidden");

  if (storedState.dashboardsById) {
    appState.dashboardsById = _.mapValues(
      storedState.dashboardsById,
      (legacyDashboard) => {
        return {
          ...legacyDashboard,
          layoutPushCards: legacyDashboard.layoutPushCards ?? "none",
        };
      }
    );
    appState.activeDashboardId = storedState.activeDashboardId || null;
  } else {
    const dashboardId = storedState.playerViewId || randomString();
    appState.dashboardsById = {
      [dashboardId]: {
        name: "Dashboard 1",
        openCardIds: storedState.openCardIds || [],
        layouts: storedState.layouts || [],
        layoutCompaction: storedState.layoutCompaction || "free",
        layoutPushCards: "none",
      },
    };
    appState.activeDashboardId = dashboardId;
  }

  return appState;
}
