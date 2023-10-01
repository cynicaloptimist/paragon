import _ from "lodash";
import GridLayout from "react-grid-layout";
import { randomString } from "../randomString";
import { AppSettings, AppState, EmptyState, UserState } from "./AppState";
import { GetInfoCards, GetInitialState } from "./GetInitialState";
import { LegacyCardState, UpdateCardState } from "./LegacyCardState";
import { CardsState } from "./CardState";

export type LegacyAppState = {
  //new
  dashboardsById?: Record<string, LegacyDashboardState>;
  activeDashboardId?: string | null;
  librarySidebarMode?: "hidden" | "cards" | "dashboards";
  user?: UserState;
  layoutPushCards?: "none" | "preventcollision";
  appSettings?: AppSettings;

  //current
  cardsById: LegacyCardsState;

  //legacy
  cardLibraryVisibility?: boolean;
  playerViewId?: string;
  openCardIds?: string[];
  layouts?: GridLayout.Layout[];
  layoutCompaction?: "free" | "compact";
};

export type LegacyDashboardState = {
  //new
  layoutPushCards?: "none" | "preventcollision";
  layoutsBySize?: GridLayout.Layouts;

  //current
  name: string;
  openCardIds?: string[];
  layoutCompaction: "free" | "compact";

  //legacy
  layouts?: GridLayout.Layout[];
};

type LegacyCardsState = Record<string, LegacyCardState>;

export function UpdateMissingOrLegacyAppState(
  storedState: Partial<LegacyAppState> | null
): AppState {
  const initialState = GetInitialState();
  if (!storedState) {
    return initialState;
  }

  const convertedCards: CardsState = {};

  const cardsById = storedState.cardsById || {};
  for (const cardState of Object.values(cardsById)) {
    convertedCards[cardState.cardId] = UpdateCardState(cardState);
  }

  const appState: AppState = {
    ...EmptyState(),
    ...storedState,
    cardsById: {
      ...convertedCards,
      ...GetInfoCards(),
    },
    dashboardsById: {},
    appSettings: {
      cardTypesInMenu: initialState.appSettings.cardTypesInMenu,
      templateIdsInMenu: initialState.appSettings.templateIdsInMenu,
      ...storedState.appSettings,
    },
  };

  if (storedState.dashboardsById) {
    appState.dashboardsById = _.mapValues(
      storedState.dashboardsById,
      (legacyDashboard) => {
        return {
          ...legacyDashboard,
          layoutPushCards: legacyDashboard.layoutPushCards ?? "none",
          layoutsBySize: legacyDashboard.layoutsBySize ?? {
            xxl: legacyDashboard.layouts || [],
          },
        };
      }
    );
  } else {
    const dashboardId = storedState.playerViewId || randomString();
    appState.dashboardsById = {
      [dashboardId]: {
        name: "Dashboard 1",
        openCardIds: storedState.openCardIds || [],
        layoutsBySize: { xxl: storedState.layouts || [] },
        layoutCompaction: storedState.layoutCompaction || "free",
        layoutPushCards: "none",
      },
    };
  }

  return appState;
}
