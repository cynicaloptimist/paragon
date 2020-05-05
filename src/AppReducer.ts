import { createReducer, Reducer } from "typesafe-actions";
import { RootAction, Actions } from "./Actions";
import { AppState, GetInitialState, CardsState } from "./AppState";

const idChars = "qwertyuiopasdfghjklzxcvbnm1234567890";
function newId(length: number = 8): string {
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * idChars.length);
    id += idChars[randomIndex];
  }
  return id;
}

export const AppReducer: Reducer<AppState, RootAction> = createReducer<
  AppState,
  RootAction
>(GetInitialState())
  .handleAction(Actions.AddCard, (oldState: AppState) => {
    const cardId = newId();
    return {
      ...oldState,
      openCardIds: oldState.openCardIds.concat(cardId),
      cardsById: {
        ...oldState.cardsById,
        [cardId]: {
          cardId,
          type: "article",
          title: "Article",
          content: "",
        },
      },
    };
  })
  .handleAction(
    [Actions.SetCardContent, Actions.SetCardTitle],
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

const CardsReducer = createReducer<CardsState, RootAction>({})
  .handleAction(Actions.SetCardContent, (oldState: CardsState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        content: action.payload.content,
      },
    };
  })
  .handleAction(Actions.SetCardTitle, (oldState: CardsState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        title: action.payload.title,
      },
    };
  });
