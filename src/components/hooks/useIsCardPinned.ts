import { useContext } from "react";
import { GetDashboard } from "../../state/AppState";
import { ReducerContext } from "../../reducers/ReducerContext";
import { useActiveDashboardId } from "./useActiveDashboardId";

export function useIsCardPinned(cardId: string) {
  const { state } = useContext(ReducerContext);
  const activeDashboardId = useActiveDashboardId();
  const activeDashboard = GetDashboard(state, activeDashboardId);
  return activeDashboard?.pinnedCardIds?.includes(cardId);
}
