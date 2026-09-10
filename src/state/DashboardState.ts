import type { ResponsiveLayouts } from "react-grid-layout";

export type DashboardState = {
  name: string;
  openCardIds?: string[];
  pinnedCardIds?: string[];
  lastOpenedTimeMs?: number;
  campaignId?: string;
  layoutsBySize: ResponsiveLayouts;
  layoutCompaction: "free" | "compact";
  layoutPushCards: "none" | "preventcollision";
};
