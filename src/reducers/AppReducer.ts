import { omit, union } from "lodash";
import { isActionOf } from "typesafe-actions";
import { Actions, CardActions, RootAction } from "../actions/Actions";
import { AppState } from "../state/AppState";
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
        ...oldState.cardsById,
        [cardId]: InitialCardState(
          cardId,
          cardType,
          Object.values(oldState.cardsById).map((card) => card.title)
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
      cardsById: omit(oldState.cardsById, action.payload.cardId),
    };
  }

  if (isActionOf(Actions.SetLayouts, action)) {
    return {
      ...oldState,
      layouts: [...oldState.layouts, ...(action.payload || [])],
    };
  }

  return {
    ...oldState,
    cardsById: CardsReducer(oldState.cardsById, action),
  };
}
