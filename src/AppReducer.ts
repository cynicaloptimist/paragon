import { createReducer } from "typesafe-actions";
import { RootAction, Actions } from "./Actions";
import { AppState, GetInitialState } from "./AppState";

const idChars = "qwertyuiopasdfghjklzxcvbnm1234567890";
function newId(length: number = 8): string {
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * idChars.length);
    id += idChars[randomIndex];
  }
  return id;
}

export const AppReducer = createReducer<AppState, RootAction>(GetInitialState())
  .handleAction(Actions.AddCard, (oldState: AppState) => {
    const cardId = newId();
    return {
      openCardIds: oldState.openCardIds.concat(cardId),
      cardsById: {
        ...oldState.cardsById,
        [cardId]: {
          cardId,
          content: ""
        }
      }
    };
  })
  .handleAction(Actions.SetCardContent, (oldState: AppState, action) => {
    const cardId = action.payload.cardId;
    return {
      openCardIds: oldState.openCardIds,
      cardsById: {
        ...oldState.cardsById,
        [cardId]: {
          ...oldState.cardsById[cardId],
          content: action.payload.content
        }
      }
    };
  });
