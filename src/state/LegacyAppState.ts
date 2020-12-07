import GridLayout from "react-grid-layout";
import { randomString } from "../randomString";
import { AppState, CardsState, DashboardState, EmptyState, UserState } from "./AppState";
import { GetInitialState } from "./GetInitialState";

export type LegacyAppState = {
  //new
  dashboardsById?: Record<string, DashboardState>;
  activeDashboardId?: string | null;
  librarySidebarMode?: "hidden" | "cards" | "dashboards";
  user?: UserState;

  //current
  cardsById: CardsState;
  cardLibraryVisibility: boolean;

  //legacy
  playerViewId?: string;
  openCardIds?: string[];
  layouts?: GridLayout.Layout[];
  layoutCompaction?: "free" | "compact";
};

export function UpdateMissingOrLegacyAppState(
  storedState: LegacyAppState | null
): AppState {
  if (!storedState) {
    return GetInitialState();
  }

  const appState = EmptyState();

  appState.cardsById = storedState.cardsById;
  appState.librarySidebarMode =
    storedState.librarySidebarMode ?? storedState.cardLibraryVisibility
      ? "cards"
      : "hidden";

  if (storedState.dashboardsById) {
    appState.dashboardsById = storedState.dashboardsById;
    appState.activeDashboardId = storedState.activeDashboardId || null;
  } else {
    const dashboardId = storedState.playerViewId || randomString();
    appState.dashboardsById = {
      [dashboardId]: {
        name: "Dashboard 1",
        openCardIds: storedState.openCardIds || [],
        layouts: storedState.layouts || [],
        layoutCompaction: storedState.layoutCompaction || "free",
      },
    };
    appState.activeDashboardId = dashboardId;
  }

  return appState;
}
