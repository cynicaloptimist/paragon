import { auth, database, Unsubscribe } from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { isEqual, union } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Actions, RootAction } from "../../actions/Actions";
import { CardActions } from "../../actions/CardActions";
import { AppState, DashboardState } from "../../state/AppState";
import { CardState } from "../../state/CardState";
import { removeUndefinedNodesFromTree } from "./removeUndefinedNodesFromTree";

const environment = process.env;
  
type ServerProfile = {
  lastUpdateTime: number;
  cardsById: Record<string, CardState>;
  dashboardsById: Record<string, DashboardState>;
};

export function useAccountSync(
  state: AppState,
  dispatch: React.Dispatch<RootAction>
) {
  if(!environment.REACT_APP_ENABLE_ACCOUNT_SYNC) {
    return;
  }
  /* eslint-disable react-hooks/rules-of-hooks */
  useTwoWayDataSync(state, dispatch);
  useUpdatesToServer(state, dispatch);
  /* eslint-enable */
}

function useTwoWayDataSync(
  state: AppState,
  dispatch: React.Dispatch<RootAction>
) {
  const authListener = useRef<Unsubscribe | null>(null);
  useEffect(() => {
    if (authListener.current) {
      return;
    }

    authListener.current = auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      if (!state.user.hasStorage) {
        return;
      }

      const localLastUpdateTime = parseInt(
        localStorage.getItem("localLastUpdateTime") || "0"
      );
      if (isNaN(localLastUpdateTime)) {
        localStorage.setItem("localLastUpdateTime", "0");
        return;
      }

      const profileRef = await database()
        .ref(`users/${user.uid}/`)
        .once("value");

      const serverProfile: ServerProfile = profileRef.val();
      if (
        !serverProfile?.lastUpdateTime ||
        serverProfile.lastUpdateTime < localLastUpdateTime
      ) {
        writeFromLocalToServer(state, serverProfile, user.uid);
      } else {
        writeFromServerToLocal(state, dispatch, serverProfile);
      }

      const currentTime = Date.now();
      localStorage.setItem("localLastUpdateTime", currentTime.toString());
      database().ref(`users/${user.uid}/lastUpdateTime`).set(currentTime);
    });
  }, [state, dispatch]);
}

type SyncedCollection = keyof ServerProfile & keyof AppState;
const collections: SyncedCollection[] = ["cardsById", "dashboardsById"];
const actionCreators: Record<
  SyncedCollection,
  (id: string, item: any) => RootAction
> = {
  cardsById: (id: string, item: any) =>
    CardActions.UpdateCardFromServer({
      cardId: id,
      cardState: item,
    }),
  dashboardsById: (id: string, item: any) =>
    Actions.UpdateDashboardFromServer({
      dashboardId: id,
      dashboardState: item,
    }),
};

function writeFromLocalToServer(
  state: AppState,
  serverProfile: ServerProfile,
  userId: string
) {
  console.log("Local data is newer, writing to DB");

  for (const collection of collections) {
    //Add new and updated items
    for (const itemId in state[collection]) {
      if (
        !isEqual(state[collection][itemId], serverProfile[collection]?.[itemId])
      ) {
        const cleanTree = removeUndefinedNodesFromTree(
          state[collection][itemId]
        );
        database()
          .ref(`users/${userId}/${collection}/${itemId}`)
          .set(cleanTree);
      }
    }
  }
}

function writeFromServerToLocal(
  state: AppState,
  dispatch: React.Dispatch<RootAction>,
  serverProfile: ServerProfile
) {
  console.log("Server data is newer, writing to local");

  for (const collection of collections) {
    //Add new and updated items
    for (const itemId in serverProfile[collection]) {
      if (
        !isEqual(state[collection][itemId], serverProfile[collection][itemId])
      ) {
        dispatch(
          actionCreators[collection](itemId, serverProfile[collection][itemId])
        );
      }
    }
  }
}

function useUpdatesToServer(
  state: AppState,
  dispatch: React.Dispatch<RootAction>
) {
  const previousState = useRef(state);

  const userId = useUserId();
  useEffect(() => {
    if (!userId || !state.user.hasStorage) {
      return;
    }

    for (const collection of collections) {
      const items = state[collection];
      const previousItems = previousState.current[collection];
      const allItemIds = union(Object.keys(items), Object.keys(previousItems));

      for (const itemId of allItemIds) {
        if (!isEqual(items[itemId], previousItems[itemId])) {
          if (items[itemId]) {
            console.log(`Updating item ${itemId} on server`);
            const cleanTree = removeUndefinedNodesFromTree(items[itemId]);
            database()
              .ref(`users/${userId}/${collection}/${itemId}`)
              .set(cleanTree);
          } else {
            console.log(`Deleting item ${itemId} on server`);

            database().ref(`users/${userId}/${collection}/${itemId}`).remove();
          }
        }
      }
    }

    previousState.current = state;
  }, [state, dispatch, userId]);
}

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      setUserId(user.uid);
    });
  }, [setUserId]);

  return userId;
}
