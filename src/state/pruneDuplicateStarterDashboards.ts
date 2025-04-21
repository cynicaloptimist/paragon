import { AppState } from "./AppState";

export function pruneDuplicateStarterDashboards(appState: AppState) {
  // If there are multiple copies of the "Dashboard 1" starter dashboard,
  // remove any duplicates that have not been edited.
  const starterDashboards = Object.entries(appState.dashboardsById).filter(
    ([, dashboard]) => dashboard.name === "Dashboard 1"
  );

  if (starterDashboards.length <= 1) {
    return;
  }

  const starterDashboardsWithOnlyInfoCards = starterDashboards.filter(
    ([, dashboard]) => {
      return dashboard.openCardIds?.every((cardId) => {
        const card = appState.cardsById[cardId];
        return card?.type === "info";
      });
    }
  );

  starterDashboardsWithOnlyInfoCards.sort(([, a], [, b]) => {
    return (a.lastOpenedTimeMs ?? 0) - (b.lastOpenedTimeMs ?? 0);
  });

  if (
    starterDashboardsWithOnlyInfoCards.length >= 1 &&
    starterDashboardsWithOnlyInfoCards.length === starterDashboards.length
  ) {
    // If all starter dashboards are empty, remove all but one.
    starterDashboardsWithOnlyInfoCards.pop();
  }

  for (const [dashboardId] of starterDashboardsWithOnlyInfoCards) {
    delete appState.dashboardsById[dashboardId];
  }
}
