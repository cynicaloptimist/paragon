import GridLayout from "react-grid-layout";
import { CardState } from "./CardState";

export type AppState = {
  cardsById: CardsState;
  dashboardsById: Record<string, DashboardState>;
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
  librarySidebarMode: "hidden",
  user: {
    isLoggedIn: false,
    hasStorage: false,
    hasEpic: false,
  },
});

export function GetDashboard(state: AppState, dashboardId: string | null) {
  if (!dashboardId) {
    return null;
  }
  return state.dashboardsById[dashboardId];
}

export function GetVisibleCards(state: AppState, dashboardId: string | null) {
  const activeDashboard = GetDashboard(state, dashboardId);
  if (!activeDashboard) {
    return [];
  }
  const openCards =
    activeDashboard.openCardIds?.map((id) => state.cardsById[id]) || [];
  return openCards.filter((card) => card);
}
