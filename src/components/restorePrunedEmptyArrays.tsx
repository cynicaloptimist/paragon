import { AppState, EmptyState } from "../state/AppState";

export function restorePrunedEmptyArrays(
  networkAppState: Partial<AppState>
): AppState {
  for (const dashboard of Object.values(networkAppState.dashboardsById || {})) {
    for (const size of Object.keys(dashboard.layoutsBySize)) {
      dashboard.layoutsBySize[size] = dashboard.layoutsBySize[size] || [];
    }
    dashboard.openCardIds = dashboard.openCardIds || [];
  }

  return {
    ...EmptyState(),
    ...networkAppState,
  };
}
