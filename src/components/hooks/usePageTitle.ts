import { useEffect } from "react";
import { AppState, GetDashboard } from "../../state/AppState";
import { useActiveDashboardId } from "./useActiveDashboardId";

export function usePageTitleFromActiveDashboardName(state: AppState) {
  const activeDashboard = GetDashboard(state, useActiveDashboardId());
  const pageTitle = activeDashboard
    ? `${activeDashboard.name} - Paragon Campaign Dashboard`
    : `Paragon Campaign Dashboard`;

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
}
