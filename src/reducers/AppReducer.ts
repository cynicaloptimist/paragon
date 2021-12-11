import { omit } from "lodash";
import { isActionOf } from "typesafe-actions";
import { Actions, RootAction } from "../actions/Actions";
import { CardActions } from "../actions/CardActions";
import { AppState, DashboardState } from "../state/AppState";
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

  if (isActionOf(Actions.UpdateDashboardFromServer, action)) {
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

  if (isActionOf(Actions.SetLibraryMode, action)) {
    return {
      ...oldState,
      librarySidebarMode: action.payload.libraryMode,
    };
  }

  if (isActionOf(Actions.CreateDashboard, action)) {
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

  if (isActionOf(Actions.ActivateDashboard, action)) {
    return {
      ...oldState,
      activeDashboardId: action.payload.dashboardId,
    };
  }

  if (isActionOf(Actions.DeleteDashboard, action)) {
    const remainingDashboards = omit(
      oldState.dashboardsById,
      action.payload.dashboardId
    );

    if (oldState.activeDashboardId === action.payload.dashboardId) {
      return {
        ...oldState,
        activeDashboardId: null,
        dashboardsById: remainingDashboards,
      };
    } else {
      return {
        ...oldState,
        dashboardsById: remainingDashboards,
      };
    }
  }

  if (oldState.activeDashboardId === null) {
    return oldState;
  }

  const activeDashboard = oldState.dashboardsById[oldState.activeDashboardId];

  const dashboardsById = {
    ...oldState.dashboardsById,
    [oldState.activeDashboardId]: DashboardReducer(activeDashboard, action),
  };

  if (isActionOf(CardActions.AddCard, action)) {
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
      dashboardsById,
    };
  }

  return {
    ...oldState,
    cardsById: CardsReducer(oldState.cardsById, action),
    dashboardsById,
  };
}
