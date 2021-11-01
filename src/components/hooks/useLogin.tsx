import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithCustomToken,
  getIdTokenResult,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import "firebase/auth";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Actions, RootAction } from "../../actions/Actions";
import { app } from "../..";

export function useLogin(dispatch: React.Dispatch<RootAction>) {
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const doAuthAsync = async () => {
      try {
        const auth = getAuth(app);
        await setPersistence(auth, browserLocalPersistence);
        const urlParams = new URLSearchParams(location.search);

        const authToken = urlParams.get("authToken");

        if (authToken) {
          await signInWithCustomToken(auth, authToken);
          const token =
            auth.currentUser &&
            (await getIdTokenResult(auth.currentUser, true));
          dispatch(
            Actions.SetUserClaims({
              hasStorage: !!token?.claims.hasStorage,
              hasEpic: !!token?.claims.hasEpic,
            })
          );

          location.search = "";
          history.replace(location);
        } else {
          const auth = getAuth(app);
          onAuthStateChanged(auth, () => {
            if (!auth.currentUser) {
              signInAnonymously(auth);
            }
          });
        }
      } catch (e) {
        console.warn(e);
      }
    };
    doAuthAsync();
  }, [location, history, dispatch]);
}
