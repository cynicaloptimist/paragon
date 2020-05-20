import { createReducer, Reducer } from "typesafe-actions";
import { RootAction, Actions } from "./Actions";
import { AppState, GetInitialState } from "./AppState";
import { CardState } from "./CardState";
import { CardsReducer } from "./CardsReducer";

export const AppReducer: Reducer<AppState, RootAction> = createReducer<
  AppState,
  RootAction
>(GetInitialState())
  .handleAction(Actions.AddCard, (oldState: AppState, action) => {
    const { cardType, cardId } = action.payload;
    return {
      ...oldState,
      openCardIds: oldState.openCardIds.concat([cardId]),
      cardsById: {
        ...oldState.cardsById,
        [cardId]: newCard(cardId, cardType),
      },
    };
  })
  .handleAction(
    [Actions.SetCardContent, Actions.SetCardTitle, Actions.SetClockValue],
    (oldState: AppState, action) => {
      return {
        ...oldState,
        cardsById: CardsReducer(oldState.cardsById, action),
      };
    }
  )
  .handleAction(Actions.SetLayouts, (oldState: AppState, action) => {
    return {
      ...oldState,
      layouts: action.payload,
    };
  });

function newCard(cardId: string, type: string): CardState {
  const baseCard = {
    cardId,
    title: "New Card",
  };

  if (type === "clock") {
    return {
      ...baseCard,
      type,
      value: 0,
      max: 6,
    };
  }

  return {
    ...baseCard,
    type: "article",
    content: "",
  };
}
