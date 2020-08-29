import { Reducer, ReducerAction, ReducerState, useReducer } from "react";

export function useStorageBackedReducer<R extends Reducer<any, any>>(
  reducer: R,
  initializeState: (localState: Partial<ReducerState<R>>) => ReducerState<R>,
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

  const storedStateJSON = localStorage.getItem(storageKey);
  const storedState = storedStateJSON ? JSON.parse(storedStateJSON) : {};
  const initialState = initializeState(storedState);

  return useReducer(reducerWithSave, initialState);
}
