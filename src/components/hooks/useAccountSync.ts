import "firebase/auth";
import { getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";
import "firebase/database";
import { getDatabase, off, onValue, ref, remove, set } from "firebase/database";
import { isEqual, union } from "lodash";
import { useEffect, useRef, useState } from "react";
import { app } from "../..";
import { Actions, RootAction } from "../../actions/Actions";
import { CardActions } from "../../actions/CardActions";
import { AppState, DashboardState } from "../../state/AppState";
import { CardState } from "../../state/CardState";
import { FirebaseUtils } from "../../FirebaseUtils";

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
  if (!environment.REACT_APP_ENABLE_ACCOUNT_SYNC) {
    return;
  }
  /* eslint-disable react-hooks/rules-of-hooks */
  const [didSync, setDidSync] = useState(false);
  useTwoWayDataSync(state, dispatch, () => setDidSync(true));
  useUpdatesToServer(state, dispatch, didSync);
  /* eslint-enable */
}

function useTwoWayDataSync(
  state: AppState,
  dispatch: React.Dispatch<RootAction>,
  done: () => void
) {
  const authListener = useRef<Unsubscribe | null>(null);
  useEffect(() => {
    if (authListener.current) {
      return;
    }
    const auth = getAuth(app);
    authListener.current = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }

      const localLastUpdateTime = parseInt(
        localStorage.getItem("localLastUpdateTime") || "0"
      );
      if (isNaN(localLastUpdateTime)) {
        localStorage.setItem("localLastUpdateTime", "0");
        return;
      }

      const database = getDatabase(app);
      const dbRef = ref(database, `users/${user.uid}`);

      onValue(dbRef, async (profileRef) => {
        off(dbRef);
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
        const updateTimeRef = ref(database, `users/${user.uid}/lastUpdateTime`);
        await set(updateTimeRef, currentTime);
        done();
      });
    });
  }, [state, dispatch, done]);
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
        const cleanTree = FirebaseUtils.removeUndefinedNodesFromTree(
          state[collection][itemId]
        );
        const database = getDatabase(app);
        const itemRef = ref(
          database,
          `users/${userId}/${collection}/${itemId}`
        );
        set(itemRef, cleanTree);
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
  dispatch: React.Dispatch<RootAction>,
  didSync: boolean
) {
  const previousState = useRef(state);

  const userId = useUserId();
  useEffect(() => {
    if (!didSync || !userId || !state.user.hasStorage) {
      return;
    }

    for (const collection of collections) {
      const items = state[collection];
      const previousItems = previousState.current[collection];
      const allItemIds = union(Object.keys(items), Object.keys(previousItems));

      for (const itemId of allItemIds) {
        const newItemPruned = FirebaseUtils.removeUndefinedNodesFromTree(items[itemId]);
        const previousItemPruned = FirebaseUtils.removeUndefinedNodesFromTree(
          previousItems[itemId]
        );

        if (!isEqual(newItemPruned, previousItemPruned)) {
          const database = getDatabase(app);
          const itemRef = ref(
            database,
            `users/${userId}/${collection}/${itemId}`
          );

          if (newItemPruned) {
            console.log(`Updating item ${itemId} on server`);
            set(itemRef, newItemPruned);
          } else {
            console.log(`Deleting item ${itemId} on server`);
            remove(itemRef);
          }
        }
      }
    }

    previousState.current = state;
  }, [state, dispatch, userId, didSync]);
}

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }
      setUserId(user.uid);
    });
    return unsubscribe;
  }, [setUserId]);

  return userId;
}
