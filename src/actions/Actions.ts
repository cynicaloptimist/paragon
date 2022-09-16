import { ActionType, createAction } from "typesafe-actions";
import { CardType } from "../state/CardTypes";
import { CardAction } from "./CardActions";
import { DashboardAction } from "./DashboardActions";

export const Actions = {
  SetUserClaims: createAction("SetUserClaims")<{
    hasStorage: boolean;
    hasEpic: boolean;
  }>(),
  SetCardTypesInMenu: createAction("SetCardTypesInMenu")<{
    cardTypes: CardType[];
  }>(),
  LogOut: createAction("LogOut")(),
};

export type Action = ActionType<typeof Actions>;
export type RootAction = Action | CardAction | DashboardAction;
