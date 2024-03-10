import "firebase/auth";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  Unsubscribe,
} from "firebase/auth";
import "firebase/database";
import { getDatabase, off, onValue, ref, remove, set } from "firebase/database";
import { isEqual, union } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { app } from "../..";
import { Actions, RootAction } from "../../actions/Actions";
import { CardActions } from "../../actions/CardActions";
import { AppState } from "../../state/AppState";
import { DashboardState } from "../../state/DashboardState";
import { CardState } from "../../state/CardState";
import { FirebaseUtils } from "../../FirebaseUtils";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";
import { DashboardActions } from "../../actions/DashboardActions";
import { CampaignState } from "../../state/CampaignState";

const environment = import.meta.env;

type ServerProfile = {
  lastUpdateTime: string;
  cardsById: Record<string, CardState>;
  dashboardsById: Record<string, DashboardState>;
  campaignsById: Record<string, CampaignState>;
};

export function useAccountSync(
  state: AppState,
  dispatch: React.Dispatch<RootAction>,
  onDashboardsLoaded: (dashboardIds: string[]) => void
) {
  if (!environment.VITE_ENABLE_ACCOUNT_SYNC) {
    return;
  }
  /* eslint-disable react-hooks/rules-of-hooks */
  const [didSync, setDidSync] = useState(false);
  useTwoWayDataSync(
    state,
    dispatch,
    () => setDidSync(true),
    onDashboardsLoaded
  );
  useUpdatesToServer(state, dispatch, didSync);
  /* eslint-enable */
}

const parseIntOrDefault = (
  value: string | null | undefined,
  defaultNumber: number
) => {
  try {
    const result = parseInt(value || "", 10);
    if (isNaN(result)) {
      return defaultNumber;
    }
    return result;
  } catch {
    return defaultNumber;
  }
};

function useTwoWayDataSync(
  state: AppState,
  dispatch: React.Dispatch<RootAction>,
  done: () => void,
  onDashboardsLoaded: (dashboardIds: string[]) => void
) {
  const authListener = useRef<Unsubscribe | null>(null);
  useEffect(() => {
    if (authListener.current) {
      return;
    }
    const auth = getAuth(app);
    authListener.current = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        done();
        return;
      }

      const localLastUpdateTime = parseInt(
        localStorage.getItem("localLastUpdateTime") || "0"
      );
      if (isNaN(localLastUpdateTime)) {
        localStorage.setItem("localLastUpdateTime", "0");
        done();
        return;
      }

      const database = getDatabase(app);
      const dbRef = ref(database, `users/${user.uid}`);

      onValue(dbRef, async (profileRef) => {
        off(dbRef);
        const serverProfile: ServerProfile | null = profileRef.val();
        const serverLastUpdateTime = parseIntOrDefault(
          serverProfile?.lastUpdateTime,
          0
        );
        if (serverLastUpdateTime <= localLastUpdateTime) {
          writeFromLocalToServer(state, serverProfile, user.uid);
        } else if (serverProfile !== null) {
          writeFromServerToLocal(state, dispatch, serverProfile);
        }

        onDashboardsLoaded([
          ...Object.keys(state.dashboardsById),
          ...Object.keys(serverProfile?.dashboardsById ?? {}),
        ]);

        const currentTime = Date.now().toString();
        localStorage.setItem("localLastUpdateTime", currentTime);
        const updateTimeRef = ref(database, `users/${user.uid}/lastUpdateTime`);
        await set(updateTimeRef, currentTime);
        done();
      });
    });
  }, [state, dispatch, done, onDashboardsLoaded]);
}

type SyncedCollection = keyof ServerProfile & keyof AppState;
const collections: SyncedCollection[] = [
  "cardsById",
  "dashboardsById",
  "campaignsById",
];
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
    DashboardActions.UpdateDashboardFromServer({
      dashboardId: id,
      dashboardState: item,
    }),
  campaignsById: (item: any) =>
    Actions.UpdateCampaignFromServer({
      campaignState: item,
    }),
};

function writeFromLocalToServer(
  state: AppState,
  serverProfile: ServerProfile | null,
  userId: string
) {
  console.log("Local data is newer, writing to DB");

  for (const collection of collections) {
    //Add new and updated items
    for (const itemId in state[collection]) {
      if (
        !isEqual(
          state[collection][itemId],
          serverProfile?.[collection]?.[itemId]
        )
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
        const newItemPruned = FirebaseUtils.removeUndefinedNodesFromTree(
          items[itemId]
        );
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
            console.log(`Updating ${collection}/${itemId} on server`);
            set(itemRef, newItemPruned);
          } else {
            console.log(`Deleting ${collection}/${itemId} on server`);
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

  const viewType = useContext(ViewTypeContext);

  useEffect(() => {
    if (viewType !== ViewType.GameMaster) {
      return;
    }

    const auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).then(() => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.log("received empty user from onAuthStateChanged");
          return;
        }
        setUserId(user.uid);
      });
    });
  }, [setUserId, viewType]);

  return userId;
}
