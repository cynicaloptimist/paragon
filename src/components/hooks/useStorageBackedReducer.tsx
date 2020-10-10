import { Reducer, ReducerAction, ReducerState, useReducer } from "react";
import { LegacyAppState } from "../../state/LegacyAppState";

export function useStorageBackedReducer<R extends Reducer<any, any>>(
  reducer: R,
  initializeState: (localState: LegacyAppState | null) => ReducerState<R>,
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
  const storedState = storedStateJSON ? JSON.parse(storedStateJSON) : null;
  const initialState = initializeState(storedState);

  return useReducer(reducerWithSave, initialState);
}
