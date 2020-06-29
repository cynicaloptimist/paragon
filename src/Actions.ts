import GridLayout from "react-grid-layout";
import { createAction, ActionType } from "typesafe-actions";
import { RollTableEntry } from "./CardState";

export const Actions = {
  AddCard: createAction("AddCard")<{
    cardId: string;
    cardType: string;
  }>(),
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
  SetCardTitle: createAction("SetCardTitle")<{
    cardId: string;
    title: string;
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
  SetLayouts: createAction("SetLayouts")<GridLayout.Layout[]>(),
  SetCardLibraryVisibility: createAction("SetCardLibraryVisibility")<{
    visibility: boolean;
  }>(),
};

export type RootAction = ActionType<typeof Actions>;
