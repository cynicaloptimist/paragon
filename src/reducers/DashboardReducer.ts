import _, { union } from "lodash";
import { isActionOf } from "typesafe-actions";
import { DashboardAction, DashboardActions } from "../actions/DashboardActions";
import { DashboardState } from "../state/DashboardState";
import { InitialLayout } from "../state/InitialLayout";

export function DashboardReducer(
  oldState: DashboardState,
  action: DashboardAction
): DashboardState {
  if (isActionOf(DashboardActions.ActivateDashboard, action)) {
    return {
      ...oldState,
      lastOpenedTimeMs: action.payload.currentTimeMs,
    };
  }

  if (isActionOf(DashboardActions.SetLayoutCompaction, action)) {
    return {
      ...oldState,
      layoutCompaction: action.payload.layoutCompaction,
    };
  }

  if (isActionOf(DashboardActions.SetLayoutPushCards, action)) {
    return {
      ...oldState,
      layoutPushCards: action.payload.layoutPushCards,
    };
  }

  if (
    isActionOf(DashboardActions.AddCard, action) ||
    isActionOf(DashboardActions.AddCardFromTemplate, action)
  ) {
    const { cardId, cardType } = action.payload;
    console.log(action.type);
    return {
      ...oldState,
      openCardIds: (oldState.openCardIds || []).concat([cardId]),
      layoutsBySize: _.mapValues(oldState.layoutsBySize, (layout, size) => {
        return _.union(layout, [InitialLayout(cardId, cardType, size)]);
      }),
    };
  }

  if (isActionOf(DashboardActions.OpenCard, action)) {
    const cardIsAlreadyOpen = oldState.openCardIds?.includes(
      action.payload.cardId
    );
    if (cardIsAlreadyOpen) {
      return oldState;
    }

    const cardAlreadyHasLayout = Object.values(oldState.layoutsBySize).some(
      (layouts) => layouts.some((layout) => layout.i === action.payload.cardId)
    );

    if (cardAlreadyHasLayout) {
      return {
        ...oldState,
        openCardIds: union(oldState.openCardIds, [action.payload.cardId]),
      };
    }

    return {
      ...oldState,
      openCardIds: union(oldState.openCardIds, [action.payload.cardId]),
      layoutsBySize: _.mapValues(oldState.layoutsBySize, (layouts, size) => {
        return union(layouts, [
          InitialLayout(action.payload.cardId, action.payload.cardType, size),
        ]);
      }),
    };
  }

  if (isActionOf(DashboardActions.CloseCard, action)) {
    return {
      ...oldState,
      openCardIds: oldState.openCardIds?.filter(
        (cardId) => cardId !== action.payload.cardId
      ),
    };
  }

  if (isActionOf(DashboardActions.SetLayouts, action)) {
    const updatedLayoutIds = action.payload.layouts.map((layout) => layout.i);
    const activeLayout = oldState.layoutsBySize[action.payload.gridSize] || [];
    const nonUpdatedLayouts = activeLayout.filter(
      (layout) => !updatedLayoutIds.includes(layout.i)
    );

    return {
      ...oldState,
      layoutsBySize: {
        ...oldState.layoutsBySize,
        [action.payload.gridSize]: [
          ...nonUpdatedLayouts,
          ...(action.payload.layouts || []),
        ],
      },
    };
  }

  if (isActionOf(DashboardActions.RenameActiveDashboard, action)) {
    return {
      ...oldState,
      name: action.payload.newName,
    };
  }

  return oldState;
}
