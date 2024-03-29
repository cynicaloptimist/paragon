import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import { Box, Button, Text } from "grommet";
import React, { useContext } from "react";
import { app } from "../..";
import { Actions } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";

export function LoginLogout() {
  const { state, dispatch } = useContext(ReducerContext);
  const environment = import.meta.env;
  if (
    !(
      environment.VITE_PATREON_CLIENT_ID &&
      environment.VITE_PATREON_LOGIN_REDIRECT_URI &&
      environment.VITE_ENABLE_ACCOUNT_SYNC
    )
  ) {
    return null;
  }

  if (state.user.isLoggedIn) {
    return (
      <Box direction="row" pad="small" align="center" justify="center">
        <Text style={{ fontStyle: "italic" }}>Logged in with Patreon</Text>
        <Button
          tip="Log out"
          icon={
            <FontAwesomeIcon
              icon={faSignOutAlt}
              onClick={async () => {
                const auth = getAuth(app);
                await auth.signOut();
                dispatch(Actions.LogOut());
              }}
            />
          }
        />
      </Box>
    );
  }

  const loginUrl = new URL("https://www.patreon.com/oauth2/authorize");
  loginUrl.searchParams.append("response_type", "code");
  loginUrl.searchParams.append("client_id", environment.VITE_PATREON_CLIENT_ID);
  loginUrl.searchParams.append(
    "redirect_uri",
    environment.VITE_PATREON_LOGIN_REDIRECT_URI
  );
  loginUrl.searchParams.append(
    "state",
    JSON.stringify({ finalRedirect: window.location.href })
  );

  return (
    <Button
      margin="small"
      alignSelf="center"
      label="Login with Patreon"
      href={loginUrl.href}
    />
  );
}
