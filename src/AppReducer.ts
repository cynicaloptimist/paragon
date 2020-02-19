import { createReducer } from "typesafe-actions";
import { RootAction, Actions } from "./Actions";
import { AppState, GetInitialState } from "./AppState";

export const AppReducer = createReducer<AppState, RootAction>(GetInitialState()).handleAction(
  Actions.AddCard,
  (oldState: AppState) => {
    return {
      cardCount: oldState.cardCount + 1
    };
  }
);
