import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import { merge } from "lodash";
import React, { useContext } from "react";
import { randomString } from "../../randomString";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState } from "../../state/AppState";
import { GetInitialState } from "../../state/GetInitialState";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";

export function CopyDashboardButton() {
  const { state } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();

  return (
    <Button
      icon={<FontAwesomeIcon icon={faCopy} />}
      label="Copy this Dashboard"
      onClick={() => SaveStateToLocalStorageAndRedirect(state, dashboardId)}
    />
  );
}

function SaveStateToLocalStorageAndRedirect(
  state: AppState,
  dashboardId: string | null
) {
  if (!dashboardId) {
    return;
  }
  const storedStateJSON = localStorage.getItem("appState");
  const storedState = storedStateJSON ? JSON.parse(storedStateJSON) : null;

  const mergedState: AppState = merge(GetInitialState(), storedState);

  const newDashboardId = randomString();
  const dashboard = state.dashboardsById[dashboardId];

  if (dashboard) {
    mergedState.dashboardsById[newDashboardId] = dashboard;
  }

  mergedState.cardsById = {
    ...mergedState.cardsById,
    ...state.cardsById,
  };

  localStorage.setItem("appState", JSON.stringify(mergedState));
  window.location.href = `/e/${newDashboardId}`;
}
