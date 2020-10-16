import GridLayout from "react-grid-layout";
import { ActionType, createAction } from "typesafe-actions";
import { PlayerViewPermission, RollTableEntry } from "../state/CardState";

export const Actions = {
  SetLayouts: createAction("SetLayouts")<GridLayout.Layout[]>(),
  SetLibraryVisibility: createAction("SetCardLibraryVisibility")<{
    visibility: boolean;
  }>(),
  SetLayoutCompaction: createAction("SetLayoutCompaction")<{
    layoutCompaction: "free" | "compact";
  }>(),
  CreateDashboard: createAction("CreateDashboard")<{ dashboardId: string }>(),
  ActivateDashboard: createAction("ActivateDashboard")<{
    dashboardId: string;
  }>(),
};

export const CardActions = {
  AddCard: createAction("AddCard")<{
    cardId: string;
    cardType: string;
  }>(),
  OpenCard: createAction("OpenCard")<{ cardId: string }>(),
  CloseCard: createAction("CloseCard")<{ cardId: string }>(),
  DeleteCard: createAction("DeleteCard")<{ cardId: string }>(),
  SetCardContent: createAction("SetCardContent")<{
    cardId: string;
    content: string;
  }>(),
  SetClockValue: createAction("SetClockValue")<{
    cardId: string;
    value: number;
  }>(),
  SetClockMax: createAction("SetClockMax")<{
    cardId: string;
    max: number;
  }>(),
  SetCardTitle: createAction("SetCardTitle")<{
    cardId: string;
    title: string;
  }>(),
  SetCardPath: createAction("SetCardPath")<{
    cardId: string;
    path: string;
  }>(),
  SetPlayerViewPermission: createAction("SetPlayerViewPermission")<{
    cardId: string;
    playerViewPermission: PlayerViewPermission;
  }>(),
  SetRollTableEntries: createAction("SetRollTableEntries")<{
    cardId: string;
    entries: RollTableEntry[];
  }>(),
  SetRollTableLastRoll: createAction("SetRollTableLastRoll")<{
    cardId: string;
    rollResult: number;
  }>(),
  SetImageUrl: createAction("SetImageUrl")<{
    cardId: string;
    imageUrl: string;
  }>(),
  RollDiceExpression: createAction("RollDiceExpression")<{
    cardId: string;
    expression: string;
    result: string;
    total: number;
  }>(),
};

export type Action = ActionType<typeof Actions>;
export type CardAction = ActionType<typeof CardActions>;
export type RootAction = Action | CardAction;
