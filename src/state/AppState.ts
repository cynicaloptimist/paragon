import { CardState } from "./CardState";
import { CardType } from "./CardTypes";
import { DashboardState } from "./DashboardState";

export type AppState = {
  cardsById: CardsState;
  dashboardsById: Record<string, DashboardState>;
  templatesById: CardsState;
  appSettings: AppSettings;
  user: UserState;
};

export type AppSettings = {
  cardTypesInMenu: CardType[];
};

export type CardsState = Record<string, CardState>;

export type UserState = {
  isLoggedIn: boolean;
  hasStorage: boolean;
  hasEpic: boolean;
};

export const EmptyState = (): AppState => ({
  cardsById: {},
  dashboardsById: {},
  templatesById: {},
  appSettings: {
    cardTypesInMenu: [],
  },
  user: {
    isLoggedIn: false,
    hasStorage: false,
    hasEpic: false,
  },
});

export function GetDashboard(state: AppState, dashboardId: string | null) {
  if (!dashboardId) {
    return null;
  }
  return state.dashboardsById[dashboardId];
}

export function GetVisibleCards(state: AppState, dashboardId: string | null) {
  const activeDashboard = GetDashboard(state, dashboardId);
  if (!activeDashboard) {
    return [];
  }
  const openCards =
    activeDashboard.openCardIds?.map((id) => {
      return {
        ...state.cardsById[id],
        cardId: id, // This helps to ensure that CardActions will work in case of a malformed CardState
      };
    }) || [];
  return openCards.filter((card) => card);
}
