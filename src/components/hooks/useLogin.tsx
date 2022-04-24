import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithCustomToken,
  getIdTokenResult,
  signInAnonymously,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import "firebase/auth";
import React, { useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Actions, RootAction } from "../../actions/Actions";
import { app } from "../..";

export function useLogin(dispatch: React.Dispatch<RootAction>) {
  const location = useLocation();
  const history = useHistory();
  const user: React.MutableRefObject<User | null> = useRef(null);

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
          return onAuthStateChanged(auth, () => {
            if (!user.current && !auth.currentUser) {
              console.log("No user, signing in anonymously");
              signInAnonymously(auth);
              dispatch(Actions.LogOut());
            } else if (auth.currentUser) {
              console.log("User ID", auth.currentUser.uid);
              user.current = auth.currentUser;
            }

            if (process.env.REACT_APP_ALL_CLAIMS === "true") {
              dispatch(
                Actions.SetUserClaims({
                  hasStorage: true,
                  hasEpic: true,
                })
              );
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
