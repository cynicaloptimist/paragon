import { useEffect, useState, useRef } from "react";
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

function getPlayerViewState(fullState: AppState): AppState {
  return {
    ...fullState,
    cardsById: pickBy(fullState.cardsById, (_, cardId) =>
      fullState.openCardIds.some((openCardId) => openCardId === cardId)
    ),
  };
}

export function useServerStateUpdates(state: AppState) {
  const [userId, setUserId] = useState<string | null>(null);
  const lastState = useRef(state);

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
    const cleanState = getPlayerViewState(removeUndefinedNodesFromTree(state));
    console.log(cleanState);

    if (JSON.stringify(lastState.current) !== JSON.stringify(cleanState)) {
      const dbRef = database().ref(`users/${userId}`);
      dbRef.set({
        playerViewState: cleanState,
      });
      lastState.current = cleanState;
    }
  }, [state, userId]);
}
