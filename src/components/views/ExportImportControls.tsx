import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import saveAs from "file-saver";
import { Box, Button, Text } from "grommet";
import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { Actions, RootAction } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState } from "../../state/AppState";

export function ExportImportControls() {
  const { state, dispatch } = useContext(ReducerContext);
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>();

  return (
    <Box flex={false} pad="small" gap="small">
      <Button
        icon={<FontAwesomeIcon icon={faDownload} />}
        label="Export cards and dashboards"
        onClick={() => exportCardsAndDashboards(state)}
      />
      <Button
        icon={<FontAwesomeIcon icon={faUpload} />}
        label="Import cards and dashboards"
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
              importCardsAndDashboards(json, state, dispatch);
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

function exportCardsAndDashboards(state: AppState) {
  const data = {
    dashboardsById: state.dashboardsById,
    cardsById: state.cardsById,
  };
  const jsonData = JSON.stringify(data, null, "\t");
  const file = new Blob([jsonData]);
  const date = new Date().toISOString();

  saveAs(file, `paragon-dashboard-data_${date}.json`);
}

function importCardsAndDashboards(
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
      return;
    }
  }

  dispatch(
    Actions.ImportCardsAndDashboards({
      cardsById: data.cardsById,
      dashboardsById: data.dashboardsById,
    })
  );
}

const ErrorText = styled(Text)`
  font-style: italic;
`;
