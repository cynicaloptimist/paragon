import GridLayout from "react-grid-layout";

export type DashboardState = {
  name: string;
  openCardIds?: string[];
  layoutsBySize: GridLayout.Layouts;
  layoutCompaction: "free" | "compact";
  layoutPushCards: "none" | "preventcollision";
};
