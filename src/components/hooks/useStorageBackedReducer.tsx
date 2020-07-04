import { Reducer, ReducerState, ReducerAction, useReducer } from "react";

export function useStorageBackedReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  storageKey: string
) {
  const reducerWithSave = (
    prevState: ReducerState<R>,
    action: ReducerAction<R>
  ) => {
    const newState: ReducerState<R> = reducer(prevState, action);
    localStorage.setItem(storageKey, JSON.stringify(newState));
    return newState;
  };

  const storedState = localStorage.getItem(storageKey);
  if (storedState) {
    initialState = {
      ...initialState,
      ...JSON.parse(storedState),
    };
  }

  return useReducer(reducerWithSave, initialState);
}
