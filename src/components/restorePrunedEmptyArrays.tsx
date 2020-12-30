import { AppState, EmptyState } from "../state/AppState";

export function restorePrunedEmptyArrays(
  networkAppState: Partial<AppState>): AppState {
  for (const dashboard of Object.values(networkAppState.dashboardsById || {})) {
    dashboard.layouts = dashboard.layouts || [];
    dashboard.openCardIds = dashboard.openCardIds || [];
  }

  return {
    ...EmptyState(),
    ...networkAppState,
  };
}
