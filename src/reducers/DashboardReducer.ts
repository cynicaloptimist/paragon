import { union } from "lodash";
import { isActionOf } from "typesafe-actions";
import { Actions, CardActions, RootAction } from "../actions/Actions";
import { DashboardState } from "../state/AppState";
import { InitialLayout } from "../state/InitialLayout";

export function DashboardReducer(
  oldState: DashboardState,
  action: RootAction
): DashboardState {
  if (isActionOf(Actions.SetLayoutCompaction, action)) {
    return {
      ...oldState,
      layoutCompaction: action.payload.layoutCompaction,
    };
  }

  if (isActionOf(CardActions.AddCard, action)) {
    const { cardId } = action.payload;
    return {
      ...oldState,
      openCardIds: oldState.openCardIds.concat([cardId]),
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
