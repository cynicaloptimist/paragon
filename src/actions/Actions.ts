import GridLayout from "react-grid-layout";
import { ActionType, createAction } from "typesafe-actions";
import { CardAction } from "./CardActions";

export const Actions = {
  SetUserClaims: createAction("SetUserClaims")<{
    hasStorage: boolean;
    hasEpic: boolean;
  }>(),
  SetLayouts: createAction("SetLayouts")<GridLayout.Layout[]>(),
  SetLibraryMode: createAction("SetLibraryMode")<{
    libraryMode: "hidden" | "cards" | "dashboards";
  }>(),
  SetLayoutCompaction: createAction("SetLayoutCompaction")<{
    layoutCompaction: "free" | "compact";
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
};

export type Action = ActionType<typeof Actions>;
export type RootAction = Action | CardAction;
