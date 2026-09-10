import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route } from "react-router-dom";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState, EmptyState } from "../../state/AppState";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";
import { CardGrid } from "./CardGrid";

function GridWithState(props: { state: AppState }) {
  return (
    <MemoryRouter initialEntries={["/p/dashboard-id"]}>
      <Route path="/p/:dashboardId">
        <ReducerContext.Provider
          value={{ state: props.state, dispatch: jest.fn() }}
        >
          <ViewTypeContext.Provider value={ViewType.Player}>
            <CardGrid />
          </ViewTypeContext.Provider>
        </ReducerContext.Provider>
      </Route>
    </MemoryRouter>
  );
}

test("renders the grid when an asynchronously loaded dashboard arrives", () => {
  const reactGlobal = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  const previousActEnvironment = reactGlobal.IS_REACT_ACT_ENVIRONMENT;
  reactGlobal.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  const loadedState: AppState = {
    ...EmptyState(),
    dashboardsById: {
      "dashboard-id": {
        name: "Dashboard",
        openCardIds: [],
        layoutsBySize: { xxl: [] },
        layoutCompaction: "free",
        layoutPushCards: "none",
      },
    },
  };

  try {
    act(() => root.render(<GridWithState state={EmptyState()} />));
    expect(container.querySelector(".react-grid-layout")).toBeNull();

    act(() => root.render(<GridWithState state={loadedState} />));
    expect(container.querySelector(".react-grid-layout")).not.toBeNull();
  } finally {
    act(() => root.unmount());
    container.remove();
    if (previousActEnvironment === undefined) {
      delete reactGlobal.IS_REACT_ACT_ENVIRONMENT;
    } else {
      reactGlobal.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
    }
  }
});
