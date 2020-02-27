import React from "react";
import { GetInitialState, AppState } from "./AppState";

export const ReducerContext = React.createContext<{
  state: AppState;
  dispatch: React.Dispatch<any>;
}>({
  state: GetInitialState(),
  dispatch: () => {}
});
