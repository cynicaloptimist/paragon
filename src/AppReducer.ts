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

export const AppReducer = createReducer<AppState, RootAction>(
  GetInitialState()
).handleAction(Actions.AddCard, (oldState: AppState) => {
  return {
    openCardsById: oldState.openCardsById.concat(newId())
  };
});
