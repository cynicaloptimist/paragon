import { cloneDeep, mapValues, omit, without } from "lodash";
import { isActionOf } from "typesafe-actions";
import { Actions, RootAction } from "../actions/Actions";
import { CardActions } from "../actions/CardActions";
import { DashboardAction, DashboardActions } from "../actions/DashboardActions";
import { AppState } from "../state/AppState";
import { CardState } from "../state/CardState";
import { DashboardState } from "../state/DashboardState";
import { InitialCardState } from "../state/InitialCardState";
import { LegacyDashboardState } from "../state/LegacyAppState";
import { UpdateCardState as UpdateLegacyCardState } from "../state/LegacyCardState";
import { CardsReducer } from "./CardsReducer";
import { DashboardReducer } from "./DashboardReducer";

export function AppReducer(oldState: AppState, action: RootAction): AppState {
  if (isActionOf(Actions.SetUserClaims, action)) {
    const newState = {
      ...oldState,
      user: {
        isLoggedIn: true,
        hasStorage: action.payload.hasStorage,
        hasEpic: action.payload.hasEpic,
      },
    };

    if (!action.payload.hasEpic) {
      newState.activeCampaignId = undefined;
    }

    return newState;
  }

  if (isActionOf(Actions.LogOut, action)) {
    return {
      ...oldState,
      user: {
        isLoggedIn: false,
        hasStorage: false,
        hasEpic: false,
      },
      activeCampaignId: undefined,
    };
  }

  if (isActionOf(DashboardActions.UpdateDashboardFromServer, action)) {
    return {
      ...oldState,
      dashboardsById: {
        ...oldState.dashboardsById,
        [action.payload.dashboardId]: {
          name: "",
          openCardIds: [],
          layoutsBySize: action.payload.dashboardState.layoutsBySize || {
            xxl:
              (action.payload.dashboardState as LegacyDashboardState).layouts ||
              [],
          },
          layoutCompaction: "free",
          layoutPushCards: "none",
          ...action.payload.dashboardState,
        },
      },
    };
  }

  if (isActionOf(CardActions.UpdateCardFromServer, action)) {
    return {
      ...oldState,
      cardsById: {
        ...oldState.cardsById,
        [action.payload.cardId]: UpdateLegacyCardState(
          action.payload.cardState
        ),
      },
    };
  }

  if (isActionOf(Actions.UpdateCampaignFromServer, action)) {
    if (!action.payload.campaignState.id) {
      return oldState;
    }
    return {
      ...oldState,
      campaignsById: {
        ...oldState.campaignsById,
        [action.payload.campaignState.id]: action.payload.campaignState,
      },
    };
  }

  if (isActionOf(DashboardActions.CreateDashboard, action)) {
    let autoIndex = 0;
    let autoName: string;
    const doesNameCollide = (dashboard: DashboardState) =>
      dashboard.name === autoName;
    do {
      autoIndex += 1;
      autoName = "Dashboard " + autoIndex;
    } while (Object.values(oldState.dashboardsById).some(doesNameCollide));

    return {
      ...oldState,
      dashboardsById: {
        ...oldState.dashboardsById,
        [action.payload.dashboardId]: {
          name: autoName,
          layoutCompaction: "free",
          layoutPushCards: "none",
          openCardIds: [],
          layoutsBySize: { xxl: [] },
          campaignId: oldState.activeCampaignId,
        },
      },
    };
  }

  if (isActionOf(DashboardActions.DeleteDashboard, action)) {
    const remainingDashboards = omit(
      oldState.dashboardsById,
      action.payload.dashboardId
    );

    return {
      ...oldState,
      dashboardsById: remainingDashboards,
    };
  }
  const dashboardsById = {
    ...oldState.dashboardsById,
  };

  const dashboardAction = action as DashboardAction;
  if (dashboardAction.payload.dashboardId) {
    const activeDashboard =
      oldState.dashboardsById[dashboardAction.payload.dashboardId];

    if (activeDashboard) {
      dashboardsById[dashboardAction.payload.dashboardId] = DashboardReducer(
        activeDashboard,
        dashboardAction
      );
    }
  }

  if (isActionOf(DashboardActions.AddCard, action)) {
    const cardId = action.payload.cardId;
    const dashboardCampaignId =
      dashboardsById[action.payload.dashboardId]?.campaignId;
    return {
      ...oldState,
      cardsById: {
        ...oldState.cardsById,
        [cardId]: InitialCardState(
          cardId,
          action.payload.cardType,
          Object.values(oldState.cardsById).map((card) => card.title),
          dashboardCampaignId
        ),
      },
      dashboardsById,
    };
  }

  if (isActionOf(DashboardActions.AddCardFromTemplate, action)) {
    const templateCopy = cloneDeep(
      oldState.templatesById[action.payload.templateId]
    );
    if (!templateCopy) {
      return oldState;
    }

    let title = templateCopy.title;
    let index = 1;
    const existingCardTitles = Object.values(oldState.cardsById).map(
      (c) => c.title
    );

    while (existingCardTitles.includes(title)) {
      title = `${templateCopy.title} ${++index}`;
    }

    const dashboardCampaignId =
      dashboardsById[action.payload.dashboardId]?.campaignId;

    const card: CardState = {
      ...templateCopy,
      cardId: action.payload.cardId,
      title,
      campaignId: dashboardCampaignId,
    };

    return {
      ...oldState,
      cardsById: {
        ...oldState.cardsById,
        [action.payload.cardId]: card,
      },
      dashboardsById,
    };
  }

  if (isActionOf(CardActions.DeleteCard, action)) {
    return {
      ...oldState,
      cardsById: omit(oldState.cardsById, action.payload.cardId),
      dashboardsById: mapValues(
        oldState.dashboardsById,
        (oldDashboardState) => {
          const openCardIds = oldDashboardState.openCardIds ?? [];
          return {
            ...oldDashboardState,
            openCardIds: openCardIds.filter(
              (id) => id !== action.payload.cardId
            ),
          };
        }
      ),
    };
  }

  if (isActionOf(Actions.CreateTemplateFromCard, action)) {
    const cardCopy = cloneDeep(oldState.cardsById[action.payload.cardId]);
    if (!cardCopy) {
      return oldState;
    }
    const template: CardState = {
      ...cardCopy,
      cardId: action.payload.templateId,
    };

    return {
      ...oldState,
      templatesById: {
        ...oldState.templatesById,
        [action.payload.templateId]: template,
      },
      appSettings: {
        ...oldState.appSettings,
        templateIdsInMenu: [
          ...oldState.appSettings.templateIdsInMenu,
          action.payload.templateId,
        ],
      },
    };
  }

  if (isActionOf(Actions.DeleteTemplate, action)) {
    return {
      ...oldState,
      templatesById: omit(oldState.templatesById, action.payload.templateId),
      appSettings: {
        ...oldState.appSettings,
        templateIdsInMenu: without(
          oldState.appSettings.templateIdsInMenu,
          action.payload.templateId
        ),
      },
    };
  }

  if (isActionOf(Actions.CreateCampaign, action)) {
    return {
      ...oldState,
      campaignsById: {
        ...oldState.campaignsById,
        [action.payload.campaignId]: {
          id: action.payload.campaignId,
          title: action.payload.title,
        },
      },
    };
  }

  if (isActionOf(Actions.SetCampaignActive, action)) {
    return {
      ...oldState,
      activeCampaignId: action.payload.campaignId,
    };
  }

  if (isActionOf(Actions.RenameCampaign, action)) {
    return {
      ...oldState,
      campaignsById: {
        ...oldState.campaignsById,
        [action.payload.campaignId]: {
          id: action.payload.campaignId,
          title: action.payload.title,
        },
      },
    };
  }

  if (isActionOf(Actions.DeleteCampaign, action)) {
    let activeCampaignId = oldState.activeCampaignId;
    if (activeCampaignId === action.payload.campaignId) {
      activeCampaignId = undefined;
    }
    return {
      ...oldState,
      activeCampaignId,
      campaignsById: omit(oldState.campaignsById, action.payload.campaignId),
      cardsById: mapValues(oldState.cardsById, (cardState) => ({
        ...cardState,
        campaignId: undefined,
      })),
      dashboardsById: mapValues(oldState.dashboardsById, (dashboardState) => ({
        ...dashboardState,
        campaignId: undefined,
      })),
    };
  }

  if (isActionOf(Actions.SetCardTypesInMenu, action)) {
    return {
      ...oldState,
      appSettings: {
        ...oldState.appSettings,
        cardTypesInMenu: action.payload.cardTypes,
      },
    };
  }

  if (isActionOf(Actions.SetTemplateIdsInMenu, action)) {
    return {
      ...oldState,
      appSettings: {
        ...oldState.appSettings,
        templateIdsInMenu: action.payload.templateIds,
      },
    };
  }

  if (isActionOf(Actions.ImportCardsAndDashboards, action)) {
    return {
      ...oldState,
      dashboardsById: {
        ...oldState.dashboardsById,
        ...action.payload.dashboardsById,
      },
      cardsById: {
        ...oldState.cardsById,
        ...action.payload.cardsById,
      },
      campaignsById: {
        ...oldState.campaignsById,
        ...action.payload.campaignsById,
      },
    };
  }

  return {
    ...oldState,
    cardsById: CardsReducer(oldState.cardsById, action),
    dashboardsById,
  };
}
