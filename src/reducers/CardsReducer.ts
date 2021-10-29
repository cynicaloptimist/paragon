import { createReducer } from "typesafe-actions";
import { RootAction } from "../actions/Actions";
import { CardAction, CardActions } from "../actions/CardActions";
import { CardsState } from "../state/AppState";
import {
  CardState,
  DiceCardState,
  RollTableCardState,
} from "../state/CardState";

function mergeCardState<T extends CardState>(
  oldState: CardsState,
  action: CardAction,
  stateUpdate: Partial<T>
): CardsState {
  const cardId = action.payload.cardId;
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
    return mergeCardState(oldState, action, {
      content: action.payload.content,
    });
  })
  .handleAction(CardActions.SetCardTitle, (oldState: CardsState, action) => {
    return mergeCardState(oldState, action, {
      title: action.payload.title,
    });
  })
  .handleAction(CardActions.SetCardPath, (oldState: CardsState, action) => {
    return mergeCardState(oldState, action, {
      path: action.payload.path,
    });
  })
  .handleAction(
    CardActions.SetPlayerViewPermission,
    (oldState: CardsState, action) => {
      return mergeCardState(oldState, action, {
        playerViewPermission: action.payload.playerViewPermission,
      });
    }
  )
  .handleAction(CardActions.SetClockValue, (oldState, action) => {
    return mergeCardState(oldState, action, {
      value: action.payload.value,
    });
  })
  .handleAction(CardActions.SetClockMax, (oldState, action) => {
    return mergeCardState(oldState, action, {
      max: action.payload.max,
    });
  })
  .handleAction(CardActions.SetClockDisplayType, (oldState, action) => {
    return mergeCardState(oldState, action, {
      displayType: action.payload.displayType,
    });
  })

  .handleAction(CardActions.SetRollTableEntries, (oldState, action) => {
    return mergeCardState(oldState, action, {
      entries: action.payload.entries,
    });
  })
  .handleAction(CardActions.SetRollTableLastRoll, (oldState, action) => {
    const oldCard = oldState[action.payload.cardId] as RollTableCardState;

    return mergeCardState(oldState, action, {
      rollHistory: [...(oldCard.rollHistory || []), action.payload.rollResult],
    });
  })
  .handleAction(CardActions.SetImageUrl, (oldState, action) => {
    return mergeCardState(oldState, action, {
      imageUrl: action.payload.imageUrl,
    });
  })
  .handleAction(CardActions.RollDiceExpression, (oldState, action) => {
    const oldCard = oldState[action.payload.cardId] as DiceCardState;
    const { cardId, ...historyItem } = action.payload;
    return mergeCardState(oldState, action, {
      history: oldCard.history.concat([historyItem]),
    });
  })
  .handleAction(CardActions.SetSketchModel, (oldState, action) => {
    return mergeCardState(oldState, action, {
      sketchModel: action.payload.sketchJSON,
    });
  });
