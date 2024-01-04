import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import saveAs from "file-saver";
import { Box, Button, Heading, Text } from "grommet";
import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { Actions, RootAction } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState } from "../../state/AppState";
import { UIContext } from "../UIContext";

export function ExportImportControls() {
  const { state, dispatch } = useContext(ReducerContext);
  const uiContext = useContext(UIContext);
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>();
  const closeSettings = () => uiContext.setAppSettingsVisible(false);

  return (
    <Box flex={false} pad="small" gap="small">
      <Text>Cards, Dashboards, and Campaigns</Text>
      <Button
        icon={<FontAwesomeIcon icon={faDownload} />}
        label="Export to .JSON"
        onClick={() => exportCardsAndDashboardsAndCampaigns(state)}
      />
      <Button
        icon={<FontAwesomeIcon icon={faUpload} />}
        label="Import from .JSON"
        onClick={() => fileInput.current?.click()}
      />
      <input
        ref={fileInput}
        type="file"
        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            const json = await file.text();
            try {
              const importedCounts = importCardsAndDashboardsAndCampaigns(
                json,
                state,
                dispatch
              );
              if (importedCounts) {
                alert(
                  `Imported data: ${importedCounts.cardsCount} cards, ${importedCounts.dashboardsCount} dashboards`
                );
                closeSettings();
              }
            } catch (exception) {
              const error = exception as Error;
              setFileError(error.message);
            }
          }
        }}
        style={{ display: "none" }}
      />
      {fileError && (
        <ErrorText>Error importing from file: {fileError}</ErrorText>
      )}
    </Box>
  );
}

function exportCardsAndDashboardsAndCampaigns(state: AppState) {
  const data = {
    dashboardsById: state.dashboardsById,
    cardsById: state.cardsById,
    campaignsById: state.campaignsById,
  };
  const jsonData = JSON.stringify(data, null, "\t");
  const file = new Blob([jsonData]);
  const date = new Date().toISOString();

  saveAs(file, `paragon-dashboard-data_${date}.json`);
}

function importCardsAndDashboardsAndCampaigns(
  json: string,
  state: AppState,
  dispatch: React.Dispatch<RootAction>
) {
  const data = JSON.parse(json);
  const incomingCardIds = Object.keys(data?.cardsById ?? {});
  const incomingDashboardIds = Object.keys(data?.dashboardsById ?? {});

  if (incomingCardIds.length + incomingDashboardIds.length === 0) {
    throw new Error("Did not find any cards or dashboards in the file.");
  }

  const cardsPendingOverwrite = Object.keys(state.cardsById).filter(
    (cardId) => {
      return incomingCardIds.includes(cardId);
    }
  );

  const dashboardsPendingOverwrite = Object.keys(state.dashboardsById).filter(
    (dashboardId) => {
      return incomingDashboardIds.includes(dashboardId);
    }
  );

  if (
    cardsPendingOverwrite.length > 0 ||
    dashboardsPendingOverwrite.length > 0
  ) {
    const doOverwrite = window.confirm(
      `This will overwrite ${cardsPendingOverwrite.length} cards and ${dashboardsPendingOverwrite.length} dashboards. Continue?`
    );
    if (!doOverwrite) {
      return false;
    }
  }

  dispatch(
    Actions.ImportCardsAndDashboards({
      cardsById: data.cardsById,
      dashboardsById: data.dashboardsById,
      campaignsById: data.campaignsById,
    })
  );

  return {
    cardsCount: Object.keys(data.cardsById).length,
    dashboardsCount: Object.keys(data.dashboardsById).length,
    campaignsCount: Object.keys(data.campaignsById).length,
  };
}

const ErrorText = styled(Text)`
  font-style: italic;
`;
