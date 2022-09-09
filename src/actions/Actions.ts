import { ActionType, createAction } from "typesafe-actions";
import { CardAction } from "./CardActions";
import { DashboardAction } from "./DashboardActions";

export const Actions = {
  SetUserClaims: createAction("SetUserClaims")<{
    hasStorage: boolean;
    hasEpic: boolean;
  }>(),
  LogOut: createAction("LogOut")(),
  SetLibraryMode: createAction("SetLibraryMode")<{
    libraryMode: "hidden" | "cards" | "dashboards";
  }>(),
};

export type Action = ActionType<typeof Actions>;
export type RootAction = Action | CardAction | DashboardAction;
