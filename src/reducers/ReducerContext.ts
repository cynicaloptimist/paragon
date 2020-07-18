import React from "react";
import { EmptyState, AppState } from "../state/AppState";

export const ReducerContext = React.createContext<{
  state: AppState;
  dispatch: React.Dispatch<any>;
}>({
  state: EmptyState(),
  dispatch: () => {}
});
