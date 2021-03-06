import { ActionType, createAction } from "typesafe-actions";
import {
  CardState,
  PlayerViewPermission,
  RollTableEntry
} from "../state/CardState";

export const CardActions = {
  AddCard: createAction("AddCard")<{
    cardId: string;
    cardType: string;
  }>(),
  OpenCard: createAction("OpenCard")<{ cardId: string }>(),
  CloseCard: createAction("CloseCard")<{ cardId: string }>(),
  DeleteCard: createAction("DeleteCard")<{ cardId: string }>(),
  UpdateCardFromServer: createAction("UpdateCardFromServer")<{
    cardId: string;
    cardState: CardState;
  }>(),
  SetCardContent: createAction("SetCardContent")<{
    cardId: string;
    content: string;
  }>(),
  SetClockValue: createAction("SetClockValue")<{
    cardId: string;
    value: number;
  }>(),
  SetClockDisplayType: createAction("SetClockDisplayType")<{
    cardId: string;
    displayType: "horizontal" | "radial";
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

export type CardAction = ActionType<typeof CardActions>;
