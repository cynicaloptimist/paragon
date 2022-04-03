import { ActionType, createAction } from "typesafe-actions";
import {
  PlayerViewPermission,
  RollTableEntry,
  SketchModelJSON,
} from "../state/CardState";
import { LegacyCardState } from "../state/LegacyCardState";

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
    cardState: LegacyCardState;
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
  SetThemeColor: createAction("SetThemeColor")<{
    cardId: string;
    themeColor: string;
  }>(),
  SetCustomColor: createAction("SetCustomColor")<{
    cardId: string;
    customColor: string;
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
    userName?: string;
  }>(),
  SetQuickRolls: createAction("SetQuickRolls")<{
    cardId: string;
    quickRolls: string[];
  }>(),
  SetSketchModel: createAction("SetSketchModel")<{
    cardId: string;
    sketchJSON: SketchModelJSON;
  }>(),
  SetPDF: createAction("SetPDF")<{
    cardId: string;
    pdfTitle: string;
    pdfURL: string;
  }>(),
  SetPDFPage: createAction("SetPDFPage")<{
    cardId: string;
    page: number;
  }>(),
  AddLedgerEntry: createAction("AddLedgerEntry")<{
    cardId: string;
    changeAmount: number;
    comment: string;
  }>(),
  RemoveLedgerEntry: createAction("RemoveLedgerEntry")<{
    cardId: string;
    ledgerEntryIndex: number;
  }>(),
  SetLedgerUnits: createAction("SetLedgerUnits")<{
    cardId: string;
    units: string;
  }>(),
  SetLedgerDecreasing: createAction("SetLedgerDecreasing")<{
    cardId: string;
    isDecreasing: boolean;
  }>(),
};

export type CardAction = ActionType<typeof CardActions>;
