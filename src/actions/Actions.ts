import { ActionType, createAction } from "typesafe-actions";
import { CardsState } from "../state/CardState";
import { DashboardState } from "../state/DashboardState";
import { CardType } from "../state/CardTypes";
import { CardAction } from "./CardActions";
import { DashboardAction } from "./DashboardActions";
import { CampaignState } from "../state/CampaignState";

export const Actions = {
  SetUserClaims: createAction("SetUserClaims")<{
    hasStorage: boolean;
    hasEpic: boolean;
  }>(),
  SetCardTypesInMenu: createAction("SetCardTypesInMenu")<{
    cardTypes: CardType[];
  }>(),
  SetTemplateIdsInMenu: createAction("SetTemplateIdsInMenu")<{
    templateIds: string[];
  }>(),
  ImportCardsAndDashboards: createAction("ImportCardsAndDashboards")<{
    cardsById: CardsState;
    dashboardsById: Record<string, DashboardState>;
    campaignsById: Record<string, CampaignState>;
  }>(),
  CreateTemplateFromCard: createAction("CreateTemplateFromCard")<{
    cardId: string;
    templateId: string;
  }>(),
  DeleteTemplate: createAction("DeleteTemplate")<{ templateId: string }>(),
  CreateCampaign: createAction("CreateCampaign")<{
    campaignId: string;
    title: string;
  }>(),
  DeleteCampaign: createAction("DeleteCampaign")<{
    campaignId: string;
  }>(),
  SetCampaignActive: createAction("SetCampaignActive")<{
    campaignId?: string;
  }>(),
  RenameCampaign: createAction("RenameCampaign")<{
    campaignId: string;
    title: string;
  }>(),
  UpdateCampaignFromServer: createAction("UpdateCampaignFromServer")<{
    campaignState: CampaignState;
  }>(),
  LogOut: createAction("LogOut")(),
};

export type Action = ActionType<typeof Actions>;
export type RootAction = Action | CardAction | DashboardAction;
