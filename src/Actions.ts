import GridLayout from "react-grid-layout";
import { createAction, ActionType } from "typesafe-actions";

export const Actions = {
  AddCard: createAction("ADD_CARD")(),
  SetCardContent: createAction("SET_CARD_CONTENT")<{
    cardId: string;
    content: string;
  }>(),
  SetLayout: createAction("SET_LAYOUT")<GridLayout.Layout[]>(),
};

export type RootAction = ActionType<typeof Actions>;
