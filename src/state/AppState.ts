import GridLayout from "react-grid-layout";
import { CardState } from "./CardState";

export type AppState = {
  cardsById: CardsState;
  dashboardsById: Record<string, DashboardState>;
  activeDashboardId: string | null;
  cardLibraryVisibility: boolean;
};

export type DashboardState = {
  openCardIds: string[];
  layouts: GridLayout.Layout[];
  layoutCompaction: "free" | "compact";
};

export type CardsState = { [cardId: string]: CardState };

export const EmptyState = (): AppState => ({
  cardsById: {},
  dashboardsById: {},
  activeDashboardId: null,
  cardLibraryVisibility: false,
});
