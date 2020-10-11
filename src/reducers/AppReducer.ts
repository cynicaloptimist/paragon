import { isActionOf } from "typesafe-actions";
import { Actions, RootAction } from "../actions/Actions";
import { AppState } from "../state/AppState";
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
    return {
      ...oldState,
      dashboardsById: {
        ...oldState.dashboardsById,
        [action.payload.dashboardId]: {
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

  return {
    ...oldState,
    cardsById: CardsReducer(oldState.cardsById, action),
    dashboardsById: {
      ...oldState.dashboardsById,
      [oldState.activeDashboardId]: DashboardReducer(
        activeDashboard,
        oldState.cardsById,
        action
      ),
    },
  };
}
