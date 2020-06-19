import { useEffect } from "react";
import { AppState } from "./AppState";
import { database } from "firebase/app";
import "firebase/database";
import pickBy from "lodash/pickBy";
import mapValues from "lodash/mapValues";

function removeUndefinedNodesFromTree(object: any): any {
  if (typeof object !== "object") {
    return object;
  }
  return mapValues(
    pickBy(object, (value) => value !== undefined),
    removeUndefinedNodesFromTree
  );
}

export function useServerStateUpdates(state: AppState) {
  useEffect(() => {
    const cleanState = removeUndefinedNodesFromTree(state);
    console.log(cleanState);
    const dbRef = database().ref("playerviews/test");
    dbRef.set({ state: cleanState });
  }, [state]);
}
