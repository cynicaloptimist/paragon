import { useEffect, useState, useRef } from "react";
import { AppState } from "../../state/AppState";
import { auth, database } from "firebase/app";
import "firebase/database";
import "firebase/auth";

import pickBy from "lodash/pickBy";
import mapValues from "lodash/mapValues";
import { PlayerViewPermission } from "../../state/CardState";

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

function omitClosedCardsFromState(fullState: AppState): AppState {
  const openCardIds = fullState.openCardIds.filter(
    (cardId) =>
      fullState.cardsById[cardId].playerViewPermission !==
      PlayerViewPermission.Hidden
  );
  return {
    ...fullState,
    openCardIds,
    cardsById: pickBy(fullState.cardsById, (_, cardId) =>
      openCardIds.some((openCardId) => openCardId === cardId)
    ),
    layouts: fullState.layouts.filter((layout) =>
      openCardIds.includes(layout.i)
    ),
  };
}

export function useServerStateUpdates(state: AppState) {
  const [userId, setUserId] = useState<string | null>(null);
  const previousState = useRef(state);

  useEffect(() => {
    auth()
      .signInAnonymously()
      .catch((e) => console.log(e));
    auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        console.log(user.uid);
        const dbRef = database().ref(`playerViews/${state.playerViewId}`);
        dbRef.set(user.uid);
      }
    });
  }, [state.playerViewId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const playerViewState = omitClosedCardsFromState(
      removeUndefinedNodesFromTree(state)
    );

    console.log(playerViewState);

    if (
      JSON.stringify(previousState.current) !== JSON.stringify(playerViewState)
    ) {
      const dbRef = database().ref(`users/${userId}`);
      dbRef.set({
        playerViewState,
      });
      previousState.current = playerViewState;
    }
  }, [state, userId]);
}
