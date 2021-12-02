import "firebase/auth";
import { Button, Text } from "grommet";
import React, { useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";

export function Login() {
  const { state } = useContext(ReducerContext);
  const environment = process.env;
  if (
    !(
      environment.REACT_APP_PATREON_CLIENT_ID &&
      environment.REACT_APP_PATREON_LOGIN_REDIRECT_URI &&
      environment.REACT_APP_ENABLE_ACCOUNT_SYNC
    )
  ) {
    return null;
  }

  if (state.user.isLoggedIn) {
    return <Text style={{ fontStyle: "italic" }}>Logged in with Patreon</Text>;
  }

  const loginUrl = new URL("https://www.patreon.com/oauth2/authorize");
  loginUrl.searchParams.append("response_type", "code");
  loginUrl.searchParams.append(
    "client_id",
    environment.REACT_APP_PATREON_CLIENT_ID
  );
  loginUrl.searchParams.append(
    "redirect_uri",
    environment.REACT_APP_PATREON_LOGIN_REDIRECT_URI
  );
  loginUrl.searchParams.append(
    "state",
    JSON.stringify({ finalRedirect: window.location.href })
  );

  return <Button label="Login with Patreon" href={loginUrl.href} />;
}
