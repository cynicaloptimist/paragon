import { cloneDeep, mapValues, omit, remove } from "lodash";
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
    return {
      ...oldState,
      user: {
        isLoggedIn: true,
        hasStorage: action.payload.hasStorage,
        hasEpic: action.payload.hasEpic,
      },
    };
  }

  if (isActionOf(Actions.LogOut, action)) {
    return {
      ...oldState,
      user: {
        isLoggedIn: false,
        hasStorage: false,
        hasEpic: false,
      },
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

    dashboardsById[dashboardAction.payload.dashboardId] = DashboardReducer(
      activeDashboard,
      dashboardAction
    );
  }

  if (isActionOf(DashboardActions.AddCard, action)) {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      cardsById: {
        ...oldState.cardsById,
        [cardId]: InitialCardState(
          cardId,
          action.payload.cardType,
          Object.values(oldState.cardsById).map((card) => card.title)
        ),
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

  if (isActionOf(CardActions.CreateTemplateFromCard, action)) {
    const cardCopy = cloneDeep(oldState.cardsById[action.payload.cardId]);
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

  if (isActionOf(CardActions.DeleteTemplate, action)) {
    return {
      ...oldState,
      templatesById: omit(oldState.templatesById, action.payload.templateId),
      appSettings: {
        ...oldState.appSettings,
        templateIdsInMenu: remove(
          oldState.appSettings.templateIdsInMenu,
          action.payload.templateId
        ),
      },
    };
  }

  if (isActionOf(DashboardActions.AddCardFromTemplate, action)) {
    const templateCopy = cloneDeep(
      oldState.templatesById[action.payload.templateId]
    );

    let title = templateCopy.title;
    let index = 1;
    const existingCardTitles = Object.values(oldState.cardsById).map(
      (c) => c.title
    );

    while (existingCardTitles.includes(title)) {
      title = `${templateCopy.title} ${++index}`;
    }

    const card: CardState = {
      ...templateCopy,
      cardId: action.payload.cardId,
      title,
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
    };
  }

  return {
    ...oldState,
    cardsById: CardsReducer(oldState.cardsById, action),
    dashboardsById,
  };
}
