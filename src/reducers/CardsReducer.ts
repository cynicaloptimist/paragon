import { createReducer } from "typesafe-actions";
import { RootAction, CardActions } from "../actions/Actions";
import { CardsState } from "../state/AppState";
import { CardState } from "../state/CardState";

function mergeCardState<T extends CardState>(
  oldState: CardsState,
  cardId: string,
  stateUpdate: Partial<T>
): CardsState {
  return {
    ...oldState,
    [cardId]: {
      ...oldState[cardId],
      ...stateUpdate,
    },
  };
}

export const CardsReducer = createReducer<CardsState, RootAction>({})
  .handleAction(CardActions.SetCardContent, (oldState: CardsState, action) => {
    return mergeCardState(oldState, action.payload.cardId, {
      content: action.payload.content,
    });
  })
  .handleAction(CardActions.SetCardTitle, (oldState: CardsState, action) => {
    return mergeCardState(oldState, action.payload.cardId, {
      title: action.payload.title,
    });
  })
  .handleAction(CardActions.SetClockValue, (oldState, action) => {
    return mergeCardState(oldState, action.payload.cardId, {
      value: action.payload.value,
    });
  })
  .handleAction(CardActions.SetClockMax, (oldState, action) => {
    return mergeCardState(oldState, action.payload.cardId, {
      max: action.payload.max,
    });
  })
  .handleAction(CardActions.SetRollTableEntries, (oldState, action) => {
    return mergeCardState(oldState, action.payload.cardId, {
      entries: action.payload.entries,
    });
  })
  .handleAction(CardActions.SetRollTableLastRoll, (oldState, action) => {
    return mergeCardState(oldState, action.payload.cardId, {
      lastRoll: action.payload.rollResult,
    });
  })
  .handleAction(CardActions.SetImageUrl, (oldState, action) => {
    return mergeCardState(oldState, action.payload.cardId, {
      imageUrl: action.payload.imageUrl,
    });
  });
