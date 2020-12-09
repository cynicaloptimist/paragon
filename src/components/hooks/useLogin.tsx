import { auth } from "firebase/app";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Actions, RootAction } from "../../actions/Actions";

export function useLogin(dispatch: React.Dispatch<RootAction>) {
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const doAuthAsync = async () => {
      try {
        await auth().setPersistence(auth.Auth.Persistence.LOCAL);
        const urlParams = new URLSearchParams(location.search);

        const authToken = urlParams.get("authToken");

        if (authToken) {
          await auth().signInWithCustomToken(authToken);
          const token = await auth().currentUser?.getIdTokenResult(true);
          dispatch(
            Actions.SetUserClaims({
              hasStorage: token?.claims.hasStorage || false,
              hasEpic: token?.claims.hasEpic || false,
            })
          );

          location.search = "";
          history.replace(location);
        } else {
          if (!auth().currentUser) {
            await auth().signInAnonymously();
          }
        }
      } catch (e) {
        console.warn(e);
      }
    };
    doAuthAsync();
  }, [location, history, dispatch]);
}
