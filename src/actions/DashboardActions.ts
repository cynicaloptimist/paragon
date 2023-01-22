import GridLayout from "react-grid-layout";
import { createAction, ActionType } from "typesafe-actions";
import { DashboardState } from "../state/DashboardState";
import { CardType } from "../state/CardTypes";

type BaseDashboardAction = { dashboardId: string };

function createDashboardAction(name: string) {
  return <T>() => createAction(name)<T & BaseDashboardAction>();
}

export const DashboardActions = {
  AddCard: createDashboardAction("AddCard")<{
    cardId: string;
    cardType: CardType;
  }>(),
  OpenCard: createDashboardAction("OpenCard")<{
    cardId: string;
    cardType: CardType;
  }>(),
  CloseCard: createDashboardAction("CloseCard")<{ cardId: string }>(),
  SetLayouts: createDashboardAction("SetLayouts")<{
    gridSize: string;
    layouts: GridLayout.Layout[];
  }>(),
  SetLayoutCompaction: createDashboardAction("SetLayoutCompaction")<{
    layoutCompaction: "free" | "compact";
  }>(),
  SetLayoutPushCards: createDashboardAction("SetLayoutPushCards")<{
    layoutPushCards: "none" | "preventcollision";
  }>(),
  CreateDashboard: createDashboardAction("CreateDashboard")<{}>(),
  DeleteDashboard: createDashboardAction("DeleteDashboard")<{}>(),
  RenameActiveDashboard: createDashboardAction("RenameActiveDashboard")<{
    newName: string;
  }>(),
  UpdateDashboardFromServer: createDashboardAction(
    "UpdateDashboardFromServer"
  )<{
    dashboardState: Partial<DashboardState>;
  }>(),
};

export type DashboardAction = ActionType<typeof DashboardActions>;
