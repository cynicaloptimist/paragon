import { CardsState } from "./CardState";
import { DashboardState } from "./DashboardState";

export type CampaignState = {
  cardsById: CardsState;
  dashboardsById: Record<string, DashboardState>;
};
