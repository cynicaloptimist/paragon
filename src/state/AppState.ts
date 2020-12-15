import GridLayout from "react-grid-layout";
import { CardState } from "./CardState";

export type AppState = {
  cardsById: CardsState;
  dashboardsById: Record<string, DashboardState>;
  activeDashboardId: string | null;
  librarySidebarMode: "hidden" | "cards" | "dashboards";
  user: UserState;
};

export type DashboardState = {
  name: string;
  openCardIds?: string[];
  layouts?: GridLayout.Layout[];
  layoutCompaction: "free" | "compact";
};

export type CardsState = Record<string, CardState>;

export type UserState = {
  isLoggedIn: boolean;
  hasStorage: boolean;
  hasEpic: boolean;
}

export const EmptyState = (): AppState => ({
  cardsById: {},
  dashboardsById: {},
  activeDashboardId: null,
  librarySidebarMode: "hidden",
  user: {
    isLoggedIn: false,
    hasStorage: false,
    hasEpic: false
  }
});

export function ActiveDashboardOf(state: AppState) {
  if(!state.activeDashboardId) {
    return null;
  }
  return state.dashboardsById[state.activeDashboardId];
}