import { useEffect, useState } from "react";
import { AppState } from "../../state/AppState";
import { auth, database } from "firebase/app";
import "firebase/database";
import "firebase/auth";

import pickBy from "lodash/pickBy";
import mapValues from "lodash/mapValues";

function removeUndefinedNodesFromTree(object: any): any {
  if (typeof object !== "object") {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(removeUndefinedNodesFromTree);
  }

  return mapValues(
    pickBy(object, (value) => value !== undefined),
    removeUndefinedNodesFromTree
  );
}

export function useServerStateUpdates(state: AppState) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    auth()
      .signInAnonymously()
      .catch((e) => console.log(e));
    auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        console.log(user.uid);
        const dbRef = database().ref(`playerViews/test`);
        dbRef.set(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const cleanState = removeUndefinedNodesFromTree(state);
    console.log(cleanState);
    const dbRef = database().ref(`users/${userId}`);
    dbRef.set({
      appState: cleanState,
      playerViewState: cleanState,
    });
  }, [state, userId]);
}
