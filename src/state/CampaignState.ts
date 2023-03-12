import { CardsState } from "./CardState";
import { DashboardState } from "./DashboardState";

export type CampaignState = {
  id: string;
  title: string;
  cardsById: CardsState;
  dashboardsById: Record<string, DashboardState>;
};
