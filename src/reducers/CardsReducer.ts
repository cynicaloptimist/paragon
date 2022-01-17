import { createReducer } from "typesafe-actions";
import { RootAction } from "../actions/Actions";
import { CardAction, CardActions } from "../actions/CardActions";
import { CardsState } from "../state/AppState";
import {
  CardState,
  DiceCardState,
  LedgerCardState,
  PDFCardState,
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
      history: (oldCard.history || []).concat([historyItem]),
    });
  })
  .handleAction(CardActions.SetSketchModel, (oldState, action) => {
    return mergeCardState(oldState, action, {
      sketchModel: action.payload.sketchJSON,
    });
  })
  .handleAction(CardActions.SetPDF, (oldState, action) => {
    return mergeCardState<PDFCardState>(oldState, action, {
      pdfUrl: action.payload.pdfURL,
      currentPage: 1,
      title: oldState.pdfUrl
        ? action.payload.pdfTitle
        : oldState[action.payload.cardId].title,
    });
  })
  .handleAction(CardActions.SetPDFPage, (oldState, action) => {
    return mergeCardState(oldState, action, {
      currentPage: action.payload.page,
    });
  })
  .handleAction(CardActions.AddLedgerEntry, (oldState, action) => {
    const oldCard = oldState[action.payload.cardId] as LedgerCardState;
    return mergeCardState(oldState, action, {
      entries: [
        ...(oldCard.entries || []),
        {
          changeAmount: action.payload.changeAmount,
          comment: action.payload.comment,
        },
      ],
    });
  })
  .handleAction(CardActions.RemoveLedgerEntry, (oldState, action) => {
    const oldCard = oldState[action.payload.cardId] as LedgerCardState;
    return mergeCardState(oldState, action, {
      entries: (oldCard.entries || []).filter(
        (_, index) => index !== action.payload.ledgerEntryIndex
      ),
    });
  })
  .handleAction(CardActions.SetLedgerUnits, (oldState, action) => {
    return mergeCardState(oldState, action, {
      units: action.payload.units,
    });
  })
  .handleAction(CardActions.SetLedgerDecreasing, (oldState, action) => {
    return mergeCardState(oldState, action, {
      isDecreasing: action.payload.isDecreasing,
    });
  });
