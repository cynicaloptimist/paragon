import { omit, union } from "lodash";
import { isActionOf } from "typesafe-actions";
import { Actions, CardActions, RootAction } from "../actions/Actions";
import { AppState, DashboardState } from "../state/AppState";
import { CardState } from "../state/CardState";
import { InitialCardState } from "../state/InitialCardState";
import { InitialLayout } from "../state/InitialLayout";
import { CardsReducer } from "./CardsReducer";

export function AppReducer(oldState: AppState, action: RootAction): AppState {
  if (isActionOf(Actions.SetCardLibraryVisibility, action)) {
    return {
      ...oldState,
      cardLibraryVisibility: action.payload.visibility,
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

function DashboardReducer(
  oldState: DashboardState,
  cardsById: Record<string, CardState>,
  action: RootAction
) {
  if (isActionOf(Actions.SetLayoutCompaction, action)) {
    return {
      ...oldState,
      layoutCompaction: action.payload.layoutCompaction,
    };
  }

  if (isActionOf(CardActions.AddCard, action)) {
    const { cardType, cardId } = action.payload;
    return {
      ...oldState,
      openCardIds: oldState.openCardIds.concat([cardId]),
      cardsById: {
        ...cardsById,
        [cardId]: InitialCardState(
          cardId,
          cardType,
          Object.values(cardsById).map((card) => card.title)
        ),
      },
      layouts: union(oldState.layouts, [InitialLayout(action.payload.cardId)]),
    };
  }

  if (isActionOf(CardActions.OpenCard, action)) {
    if (oldState.openCardIds.includes(action.payload.cardId)) {
      return oldState;
    }

    if (oldState.layouts.some((layout) => layout.i === action.payload.cardId)) {
      return {
        ...oldState,
        openCardIds: union(oldState.openCardIds, [action.payload.cardId]),
      };
    }

    return {
      ...oldState,
      openCardIds: union(oldState.openCardIds, [action.payload.cardId]),
      layouts: union(oldState.layouts, [InitialLayout(action.payload.cardId)]),
    };
  }

  if (isActionOf(CardActions.CloseCard, action)) {
    return {
      ...oldState,
      openCardIds: oldState.openCardIds.filter(
        (cardId) => cardId !== action.payload.cardId
      ),
    };
  }

  if (isActionOf(CardActions.DeleteCard, action)) {
    return {
      ...oldState,
      openCardIds: oldState.openCardIds.filter(
        (openCardId) => openCardId !== action.payload.cardId
      ),
      cardsById: omit(cardsById, action.payload.cardId),
    };
  }

  if (isActionOf(Actions.SetLayouts, action)) {
    const updatedLayoutIds = action.payload.map((layout) => layout.i);
    const nonUpdatedLayouts = oldState.layouts.filter(
      (layout) => !updatedLayoutIds.includes(layout.i)
    );
    return {
      ...oldState,
      layouts: [...nonUpdatedLayouts, ...(action.payload || [])],
    };
  }

  return oldState;
}
