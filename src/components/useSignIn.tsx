import { auth } from "firebase/app";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export function useSignIn() {
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
          console.log(JSON.stringify(token?.claims));
        })
        .catch((e) => console.log(e));

      location.search = "";
      history.replace(location);
    } else {
      auth()
        .signInAnonymously()
        .catch((e) => console.log(e));
    }
  }, [location, history]);
}
