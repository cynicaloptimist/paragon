import GridLayout from "react-grid-layout";
import { createAction, ActionType } from "typesafe-actions";
import { RollTableEntry } from "./CardState";

export const Actions = {
  AddCard: createAction("ADD_CARD")<{
    cardId: string;
    cardType: string;
  }>(),
  SetCardContent: createAction("SET_CARD_CONTENT")<{
    cardId: string;
    content: string;
  }>(),
  SetClockValue: createAction("SET_CLOCK_VALUE")<{
    cardId: string;
    value: number;
  }>(),
  SetCardTitle: createAction("SET_CARD_TITLE")<{
    cardId: string;
    title: string;
  }>(),
  SetRollTableEntries: createAction("SET_ROLL_TABLE_ENTRIES")<{
    cardId: string;
    entries: RollTableEntry[];
  }>(),
  SetLayouts: createAction("SET_LAYOUT")<GridLayout.Layout[]>(),
};

export type RootAction = ActionType<typeof Actions>;
