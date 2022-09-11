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
  layoutsBySize: GridLayout.Layouts;
  layoutCompaction: "free" | "compact";
  layoutPushCards: "none" | "preventcollision";
};

export type CardsState = Record<string, CardState>;

export type UserState = {
  isLoggedIn: boolean;
  hasStorage: boolean;
  hasEpic: boolean;
};

export const EmptyState = (): AppState => ({
  cardsById: {},
  dashboardsById: {},
  activeDashboardId: null,
  librarySidebarMode: "hidden",
  user: {
    isLoggedIn: false,
    hasStorage: false,
    hasEpic: false,
  },
});

export function GetDashboard(state: AppState) {
  if (!state.activeDashboardId) {
    return null;
  }
  return state.dashboardsById[state.activeDashboardId];
}

export function GetVisibleCards(state: AppState) {
  const activeDashboard = GetDashboard(state);
  if (!activeDashboard) {
    return [];
  }
  const openCards =
    activeDashboard.openCardIds?.map((id) => state.cardsById[id]) || [];
  return openCards.filter((card) => card);
}
