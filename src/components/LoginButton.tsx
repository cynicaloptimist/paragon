import { auth } from "firebase/app";
import "firebase/auth";
import { Button } from "grommet";
import React, { useEffect, useState } from "react";

export function LoginButton() {
  const environment = process.env;
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);

  if (
    !(
      environment.REACT_APP_PATREON_CLIENT_ID &&
      environment.REACT_APP_PATREON_LOGIN_REDIRECT_URI &&
      userId
    )
  ) {
    return null;
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
  loginUrl.searchParams.append("state", userId);

  return <Button label="Login" href={loginUrl.href} />;
}
