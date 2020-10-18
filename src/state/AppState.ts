import GridLayout from "react-grid-layout";
import { CardState } from "./CardState";

export type AppState = {
  cardsById: CardsState;
  dashboardsById: Record<string, DashboardState>;
  activeDashboardId: string | null;
  librarySidebarMode: "hidden" | "cards" | "dashboards";
};

export type DashboardState = {
  name: string;
  openCardIds: string[];
  layouts: GridLayout.Layout[];
  layoutCompaction: "free" | "compact";
};

export type CardsState = { [cardId: string]: CardState };

export const EmptyState = (): AppState => ({
  cardsById: {},
  dashboardsById: {},
  activeDashboardId: null,
  librarySidebarMode: "hidden",
});
