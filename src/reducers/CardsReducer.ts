import { createReducer } from "typesafe-actions";
import { RootAction, CardActions } from "../actions/Actions";
import { CardsState } from "../state/AppState";

export const CardsReducer = createReducer<CardsState, RootAction>({})
  .handleAction(CardActions.SetCardContent, (oldState: CardsState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        content: action.payload.content,
      },
    };
  })
  .handleAction(CardActions.SetCardTitle, (oldState: CardsState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        title: action.payload.title,
      },
    };
  })
  .handleAction(CardActions.SetClockValue, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        value: action.payload.value,
      },
    };
  })
  .handleAction(CardActions.SetClockMax, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        max: action.payload.max,
      },
    };
  })
  .handleAction(CardActions.SetRollTableEntries, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        entries: action.payload.entries,
      },
    };
  })
  .handleAction(CardActions.SetRollTableLastRoll, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        lastRoll: action.payload.rollResult,
      },
    };
  })
  .handleAction(CardActions.SetImageUrl, (oldState, action) => {
    const cardId = action.payload.cardId;
    return {
      ...oldState,
      [cardId]: {
        ...oldState[cardId],
        imageUrl: action.payload.imageUrl,
      },
    };
  });
