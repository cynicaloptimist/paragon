import _ from "lodash";
import { randomString } from "../randomString";
import { AppState, EmptyState } from "./AppState";
import { CardTypes } from "./CardTypes";
import {
  GetWelcomeCard,
  GetCardTypesCard,
  GetCampaignsCard,
} from "./InfoCards";

export function GetInfoCards() {
  const welcomeCard = GetWelcomeCard();
  const cardTypesCard = GetCardTypesCard();
  const campaignsCard = GetCampaignsCard();
  return {
    [welcomeCard.cardId]: welcomeCard,
    [cardTypesCard.cardId]: cardTypesCard,
    [campaignsCard.cardId]: campaignsCard,
  };
}

export const GetInitialState = (): AppState => {
  const firstDashboardId = randomString();
  const infoCards = GetInfoCards();
  const emptyState = EmptyState();
  return {
    ...emptyState,
    appSettings: {
      ...emptyState.appSettings,
      cardTypesInMenu: _.difference(CardTypes, [
        "info",
        "ledger",
        "pdf",
        "frame",
      ]),
    },
    cardsById: infoCards,
    dashboardsById: {
      [firstDashboardId]: {
        name: "Dashboard 1",
        openCardIds: [GetWelcomeCard().cardId],
        layoutsBySize: {
          xxl: [
            {
              i: GetWelcomeCard().cardId,
              h: 8,
              w: 8,
              x: 2,
              y: 0,
            },
          ],
        },
        layoutCompaction: "free",
        layoutPushCards: "none",
      },
    },
  };
};
