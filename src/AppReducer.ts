import { isActionOf } from "typesafe-actions";
import { omit } from "lodash";

import { RootAction, Actions } from "./Actions";
import { AppState } from "./AppState";
import { CardsReducer } from "./CardsReducer";
import { InitialCardState } from "./InitialCardState";

export function AppReducer(oldState: AppState, action: RootAction) {
  if (isActionOf(Actions.AddCard, action)) {
    const { cardType, cardId } = action.payload;
    return {
      ...oldState,
      openCardIds: oldState.openCardIds.concat([cardId]),
      cardsById: {
        ...oldState.cardsById,
        [cardId]: InitialCardState(cardId, cardType),
      },
    };
  }

  if (isActionOf(Actions.CloseCard, action)) {
    return {
      ...oldState,
      openCardIds: oldState.openCardIds.filter(
        (cardId) => cardId !== action.payload.cardId
      ),
    };
  }

  if (isActionOf(Actions.DeleteCard, action)) {
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
      layouts: action.payload,
    };
  }

  return {
    ...oldState,
    cardsById: CardsReducer(oldState.cardsById, action),
  };
}
