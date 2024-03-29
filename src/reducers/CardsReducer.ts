import { createReducer } from "typesafe-actions";
import { RootAction } from "../actions/Actions";
import { CardAction, CardActions } from "../actions/CardActions";
import { CardsState } from "../state/CardState";
import {
  CardState,
  ClockCardState,
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
  const oldCardState = oldState[cardId];
  if (!oldCardState) {
    return oldState;
  }
  return {
    ...oldState,
    [cardId]: {
      ...oldCardState,
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
  .handleAction(CardActions.SetThemeColor, (oldState: CardsState, action) => {
    return mergeCardState(oldState, action, {
      themeColor: action.payload.themeColor,
    });
  })
  .handleAction(CardActions.SetCustomColor, (oldState: CardsState, action) => {
    return mergeCardState(oldState, action, {
      themeColor: "custom",
      customColor: action.payload.customColor,
    });
  })
  .handleAction(CardActions.SetCardCampaign, (oldState: CardsState, action) => {
    return mergeCardState(oldState, action, {
      campaignId: action.payload.campaignId,
    });
  })
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
  .handleAction(CardActions.SetClockDetail, (oldState, action) => {
    const oldCard = oldState[action.payload.cardId] as ClockCardState;
    const newDetails = (oldCard.details || []).slice();
    newDetails[action.payload.detailIndex] = action.payload.detail;
    return mergeCardState(oldState, action, {
      details: newDetails,
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
  .handleAction(CardActions.PushRollTableHistory, (oldState, action) => {
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
  .handleAction(CardActions.SetQuickRolls, (oldState, action) => {
    return mergeCardState(oldState, action, {
      quickRolls: action.payload.quickRolls,
    });
  })
  .handleAction(CardActions.RevertToDefaultQuickRolls, (oldState, action) => {
    return mergeCardState(oldState, action, {
      quickRolls: undefined,
    });
  })
  .handleAction(CardActions.SetShowHistoryLength, (oldState, action) => {
    return mergeCardState(oldState, action, {
      showHistoryLength: action.payload.unlimited
        ? undefined
        : action.payload.showHistoryLength,
    });
  })
  .handleAction(CardActions.SetSceneElements, (oldState, action) => {
    return mergeCardState(oldState, action, {
      sceneElementJSONs: action.payload.sceneElementJSONs,
    });
  })
  .handleAction(CardActions.SetPDF, (oldState, action) => {
    const oldCardState = oldState[action.payload.cardId];
    if (!oldCardState) {
      return oldState;
    }
    return mergeCardState<PDFCardState>(oldState, action, {
      pdfUrl: action.payload.pdfURL,
      currentPage: 1,
      title: oldState.pdfUrl ? action.payload.pdfTitle : oldCardState.title,
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
  })
  .handleAction(CardActions.SetFrameUrl, (oldState, action) => {
    return mergeCardState(oldState, action, {
      frameUrl: action.payload.frameUrl,
    });
  });
