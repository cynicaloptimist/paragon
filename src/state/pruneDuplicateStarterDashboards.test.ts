import { EmptyState } from "./AppState";
import { DashboardState } from "./DashboardState";
import { pruneDuplicateStarterDashboards } from "./pruneDuplicateStarterDashboards";
import { CardState } from "./CardState";

function EmptyDashboard(name: string = ""): DashboardState {
  return {
    name,
    layoutCompaction: "free",
    layoutPushCards: "none",
    openCardIds: [],
    layoutsBySize: { xxl: [] },
  };
}

describe("Prune Duplicate Starter Dashboards", () => {
  test("Should have no effect if no starters", () => {
    const appState = EmptyState();
    appState.dashboardsById = {
      "1": EmptyDashboard("Some Dashboard"),
      "2": EmptyDashboard("Another Dashboard"),
    };

    pruneDuplicateStarterDashboards(appState);
    expect(appState.dashboardsById).toEqual({
      "1": EmptyDashboard("Some Dashboard"),
      "2": EmptyDashboard("Another Dashboard"),
    });
  });

  test("Should have no effect if there is only one starter dashboard", () => {
    const appState = EmptyState();
    appState.dashboardsById = {
      "1": EmptyDashboard("Some Dashboard"),
      "2": EmptyDashboard("Dashboard 1"),
    };

    pruneDuplicateStarterDashboards(appState);
    expect(appState.dashboardsById).toEqual({
      "1": EmptyDashboard("Some Dashboard"),
      "2": EmptyDashboard("Dashboard 1"),
    });
  });

  test("Should remove the oldest duplicate starter dashboards", () => {
    const appState = EmptyState();
    const oldStarterDashboard = {
      ...EmptyDashboard("Dashboard 1"),
      lastOpenedTimeMs: 1000,
    };
    const newStarterDashboard = {
      ...EmptyDashboard("Dashboard 1"),
      lastOpenedTimeMs: 2000,
    };
    appState.dashboardsById = {
      "1": EmptyDashboard("Some Dashboard"),
      "2": oldStarterDashboard,
      "3": newStarterDashboard,
      "4": oldStarterDashboard,
    };

    pruneDuplicateStarterDashboards(appState);
    expect(appState.dashboardsById).toEqual({
      "1": EmptyDashboard("Some Dashboard"),
      "3": newStarterDashboard,
    });
  });

  test("Should not remove starter dashboards with non-info cards", () => {
    const appState = EmptyState();
    const oldStarterDashboard = {
      ...EmptyDashboard("Dashboard 1"),
      lastOpenedTimeMs: 1000,
      openCardIds: ["1", "2"],
    };
    const newStarterDashboard = {
      ...EmptyDashboard("Dashboard 1"),
      lastOpenedTimeMs: 2000,
      openCardIds: ["1", "2"],
    };
    appState.cardsById = {
      "1": { type: "info" } as CardState,
      "2": { type: "article" } as CardState,
    };
    appState.dashboardsById = {
      "1": EmptyDashboard("Some Dashboard"),
      "2": oldStarterDashboard,
      "3": newStarterDashboard,
    };

    pruneDuplicateStarterDashboards(appState);
    expect(appState.dashboardsById).toEqual({
      "1": EmptyDashboard("Some Dashboard"),
      "2": oldStarterDashboard,
      "3": newStarterDashboard,
    });
  });

  test("Should prioritize removing empty starter dashboards", () => {
    const appState = EmptyState();
    const oldStarterDashboard = {
      ...EmptyDashboard("Dashboard 1"),
      lastOpenedTimeMs: 1000,
      openCardIds: ["1", "2"],
    };
    const newStarterDashboard = {
      ...EmptyDashboard("Dashboard 1"),
      lastOpenedTimeMs: 2000,
      openCardIds: ["1"],
    };
    appState.cardsById = {
      "1": { type: "info" } as CardState,
      "2": { type: "article" } as CardState,
    };
    appState.dashboardsById = {
      "1": EmptyDashboard("Some Dashboard"),
      "2": oldStarterDashboard,
      "3": newStarterDashboard,
    };

    pruneDuplicateStarterDashboards(appState);
    expect(appState.dashboardsById).toEqual({
      "1": EmptyDashboard("Some Dashboard"),
      "2": oldStarterDashboard,
    });
  });
});
