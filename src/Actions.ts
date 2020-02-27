import { createAction, ActionType } from "typesafe-actions";

export const Actions = {
  AddCard: createAction("ADD_CARD")(),
  SetCardContent: createAction("SET_CARD_CONTENT")<{
    cardId: string;
    content: string;
  }>()
};

export type RootAction = ActionType<typeof Actions>;
