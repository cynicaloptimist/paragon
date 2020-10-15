import { omit } from "lodash";
import { isActionOf } from "typesafe-actions";
import { Actions, CardActions, RootAction } from "../actions/Actions";
import { AppState, DashboardState } from "../state/AppState";
import { InitialCardState } from "../state/InitialCardState";
import { CardsReducer } from "./CardsReducer";
import { DashboardReducer } from "./DashboardReducer";

export function AppReducer(oldState: AppState, action: RootAction): AppState {
  if (isActionOf(Actions.SetCardLibraryVisibility, action)) {
    return {
      ...oldState,
      cardLibraryVisibility: action.payload.visibility,
    };
  }

  if (isActionOf(Actions.CreateDashboard, action)) {
    let autoIndex = 0;
    let autoName: string;
    const doesNameCollide = (dashboard: DashboardState) => dashboard.name === autoName;
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
          openCardIds: [],
          layouts: [],
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
