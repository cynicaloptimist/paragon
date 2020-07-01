import { createReducer } from "typesafe-actions";
import { RootAction, Actions } from "../actions/Actions";
import { CardsState } from "../state/AppState";

export const CardsReducer = createReducer<CardsState, RootAction>({})
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
  })
  .handleAction(Actions.SetClockValue, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        value: action.payload.value,
      },
    };
  })
  .handleAction(Actions.SetRollTableEntries, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        entries: action.payload.entries,
      },
    };
  })
  .handleAction(Actions.SetRollTableLastRoll, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        lastRoll: action.payload.rollResult,
      },
    };
  })
  .handleAction(Actions.SetImageUrl, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        imageUrl: action.payload.imageUrl,
      },
    };
  });
