import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import { merge } from "lodash";
import React, { useContext } from "react";
import { randomString } from "../randomString";
import { ReducerContext } from "../reducers/ReducerContext";
import { AppState } from "../state/AppState";
import { GetInitialState } from "../state/GetInitialState";

export function CopyDashboardButton() {
  const { state } = useContext(ReducerContext);

  return (
    <Button
      icon={<FontAwesomeIcon icon={faCopy} />}
      label="Copy this Dashboard"
      onClick={() => {
        if (!state.activeDashboardId) {
          return;
        }
        const storedStateJSON = localStorage.getItem("appState");
        const storedState = storedStateJSON
          ? JSON.parse(storedStateJSON)
          : null;

        const mergedState: AppState = merge(GetInitialState(), storedState);

        const newDashboardId = randomString();
        mergedState.activeDashboardId = newDashboardId;
        mergedState.dashboardsById[newDashboardId] =
          state.dashboardsById[state.activeDashboardId];
        mergedState.cardsById = {
          ...mergedState.cardsById,
          ...state.cardsById,
        };

        localStorage.setItem("appState", JSON.stringify(mergedState));
        window.location.href = "../../";
      }}
    />
  );
}
