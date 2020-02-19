import { createAction, ActionType } from "typesafe-actions";

export const Actions = {
  AddCard: createAction("ADD_CARD")()
};

export type RootAction = ActionType<typeof Actions>;
