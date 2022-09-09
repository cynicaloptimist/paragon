import GridLayout from "react-grid-layout";
import { createAction, ActionType } from "typesafe-actions";
import { DashboardState } from "../state/AppState";

export const DashboardActions = {
  SetLayouts: createAction("SetLayouts")<{
    gridSize: string;
    layouts: GridLayout.Layout[];
  }>(),
  SetLayoutCompaction: createAction("SetLayoutCompaction")<{
    layoutCompaction: "free" | "compact";
  }>(),
  SetLayoutPushCards: createAction("SetLayoutPushCards")<{
    layoutPushCards: "none" | "preventcollision";
  }>(),
  CreateDashboard: createAction("CreateDashboard")<{ dashboardId: string }>(),
  ActivateDashboard: createAction("ActivateDashboard")<{
    dashboardId: string;
  }>(),
  DeleteDashboard: createAction("DeleteDashboard")<{
    dashboardId: string;
  }>(),
  RenameActiveDashboard: createAction("RenameActiveDashboard")<{
    newName: string;
  }>(),
  UpdateDashboardFromServer: createAction("UpdateDashboardFromServer")<{
    dashboardId: string;
    dashboardState: Partial<DashboardState>;
  }>(),
};

export type DashboardAction = ActionType<typeof DashboardActions>;
