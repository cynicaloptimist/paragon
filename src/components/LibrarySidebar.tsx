import { Box, Button, Header, Heading } from "grommet";
import React, { useContext } from "react";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardLibrary } from "./CardLibrary";
import { DashboardLibrary } from "./DashboardLibrary";
import { LibrarySidebarControls } from "./LibrarySidebarControls";

export function LibrarySidebar() {
  const { state } = useContext(ReducerContext);

  return (
    <Box
      background="background"
      elevation="large"
      style={{ position: "fixed", left: 0, width: "300px", height: "100%" }}
    >
      <Header background="brand" pad="small">
        <LibrarySidebarControls />
        <Heading level={3} margin="none">
          {state.librarySidebarMode === "dashboards" ? "Dashboards" : "Cards"}
        </Heading>
      </Header>
      {state.librarySidebarMode === "dashboards" ? (
        <DashboardLibrary />
      ) : (
        <CardLibrary />
      )}
      <LoginButton />
    </Box>
  );
}

function LoginButton() {
  const environment = process.env;
  if (
    !(
      environment.REACT_APP_PATREON_CLIENT_ID &&
      environment.REACT_APP_PATREON_LOGIN_REDIRECT_URI
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

  return <Button label="Login" href={loginUrl.href} />;
}
