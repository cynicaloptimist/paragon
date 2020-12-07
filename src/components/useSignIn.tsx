import { auth } from "firebase/app";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Actions, RootAction } from "../actions/Actions";

export function useSignIn(dispatch: React.Dispatch<RootAction>) {
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const authToken = urlParams.get("authToken");

    if (authToken) {
      auth()
        .signInWithCustomToken(authToken)
        .then(async () => {
          const token = await auth().currentUser?.getIdTokenResult(true);
          dispatch(
            Actions.SetUserClaims({
              hasStorage: token?.claims.hasStorage || false,
              hasEpic: token?.claims.hasEpic || false,
            })
          );
        })
        .catch((e) => console.log(e));

      location.search = "";
      history.replace(location);
    } else {
      auth()
        .signInAnonymously()
        .catch((e) => console.log(e));
    }
  }, [location, history, dispatch]);
}
