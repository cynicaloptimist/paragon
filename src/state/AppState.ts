import { CampaignState } from "./CampaignState";
import { CardState, CardsState } from "./CardState";
import { CardType } from "./CardTypes";
import { DashboardState } from "./DashboardState";

export type AppState = {
  cardsById: CardsState;
  dashboardsById: Record<string, DashboardState>;
  templatesById: CardsState;
  campaignsById: Record<string, CampaignState>;
  appSettings: AppSettings;
  user: UserState;
  activeCampaignId?: string;
};

export type AppSettings = {
  cardTypesInMenu: CardType[];
  templateIdsInMenu: string[];
  collapseMargins?: boolean;
};

export type UserState = {
  isLoggedIn: boolean;
  hasStorage: boolean;
  hasEpic: boolean;
};

export const EmptyState = (): AppState => ({
  cardsById: {},
  dashboardsById: {},
  templatesById: {},
  campaignsById: {},
  appSettings: {
    cardTypesInMenu: [],
    templateIdsInMenu: [],
  },
  user: {
    isLoggedIn: false,
    hasStorage: false,
    hasEpic: false,
  },
});

export function GetDashboard(state: AppState, dashboardId: string | null) {
  if (!dashboardId) {
    return undefined;
  }
  return state.dashboardsById[dashboardId];
}

export function GetVisibleCards(
  state: AppState,
  dashboardId: string | null
): CardState[] {
  const activeDashboard = GetDashboard(state, dashboardId);
  if (!activeDashboard) {
    return [];
  }
  const openCards =
    activeDashboard.openCardIds
      ?.map((id) => {
        const cardState = state.cardsById[id];
        if (cardState) {
          // This helps to ensure that CardActions will work in case of a malformed CardState
          cardState.cardId = id;
        }
        return cardState;
      })
      .filter(isDefined) || [];
  return openCards;
}

export function isDefined<T>(obj: T | undefined): obj is T {
  return obj !== undefined;
}
