import { ActionType, createAction } from "typesafe-actions";
import {
  ClockCardDisplayType,
  PlayerViewPermission,
  RollTableEntry,
} from "../state/CardState";
import { LegacyCardState } from "../state/LegacyCardState";

export const CardActions = {
  DeleteCard: createAction("DeleteCard")<{ cardId: string }>(),
  UpdateCardFromServer: createAction("UpdateCardFromServer")<{
    cardId: string;
    cardState: LegacyCardState;
  }>(),
  CreateTemplateFromCard: createAction("CreateTemplateFromCard")<{
    cardId: string;
    templateId: string;
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

  // Type-specific actions
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
    displayType: ClockCardDisplayType;
  }>(),
  SetClockMax: createAction("SetClockMax")<{
    cardId: string;
    max: number;
  }>(),
  SetClockDetail: createAction("SetClockDetails")<{
    cardId: string;
    detail: string;
    detailIndex: number;
  }>(),
  SetRollTableEntries: createAction("SetRollTableEntries")<{
    cardId: string;
    entries: RollTableEntry[];
  }>(),
  PushRollTableHistory: createAction("PushRollTableHistory")<{
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
  RevertToDefaultQuickRolls: createAction("RevertToDefaultQuickRolls")<{
    cardId: string;
  }>(),
  SetShowHistoryLength: createAction("SetShowHistoryLength")<{
    cardId: string;
    showHistoryLength?: number;
    unlimited?: boolean;
  }>(),
  SetSceneElements: createAction("SetSceneElements")<{
    cardId: string;
    sceneElementJSONs: string[];
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
  SetFrameUrl: createAction("SetFrameUrl")<{
    cardId: string;
    frameUrl: string;
  }>(),
};

export type CardAction = ActionType<typeof CardActions>;
