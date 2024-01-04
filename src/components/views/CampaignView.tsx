import { useParams } from "react-router-dom";
import { AppReducer } from "../../reducers/AppReducer";
import { UpdateMissingOrLegacyAppState } from "../../state/LegacyAppState";
import { useLogin } from "../hooks/useLogin";
import { useStorageBackedReducer } from "../hooks/useStorageBackedReducer";
import { Grommet, Box } from "grommet";
import { Theme } from "../../Theme";
import { ReducerContext } from "../../reducers/ReducerContext";
import { UIContext, useUIContextState } from "../UIContext";
import { LibrarySidebar } from "../sidebar/LibrarySidebar";
import { TopBar } from "../topbar/TopBar";
import { AppSettings } from "./AppSettings";
import { useEffect } from "react";
import { Actions } from "../../actions/Actions";
import { DashboardLibrary } from "../sidebar/DashboardLibrary/DashboardLibrary";

export default function CampaignView() {
  const [state, dispatch] = useStorageBackedReducer(
    AppReducer,
    UpdateMissingOrLegacyAppState,
    "appState"
  );
  const uiContext = useUIContextState();
  const { campaignId } = useParams<{ campaignId: string | undefined }>();

  useLogin(dispatch);

  useEffect(() => {
    if (state.activeCampaignId !== campaignId) {
      dispatch(Actions.SetCampaignActive({ campaignId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, dispatch]);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <UIContext.Provider value={uiContext}>
        <Grommet style={{ minHeight: "100%" }} theme={Theme}>
          <Box fill align="center">
            <TopBar />
            <DashboardLibrary />
            {uiContext.librarySidebarMode !== "hidden" && <LibrarySidebar />}
            {uiContext.appSettingsVisible && <AppSettings />}
          </Box>
        </Grommet>
      </UIContext.Provider>
    </ReducerContext.Provider>
  );
}
