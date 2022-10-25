import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import saveAs from "file-saver";
import { Box, Button, Text } from "grommet";
import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { RootAction } from "../../actions/Actions";
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
              importCardsAndDashboards(json, dispatch);
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
  json: unknown,
  dispatch: React.Dispatch<RootAction>
) {
  console.log(json);
  throw new Error("Not Implemented");
}

const ErrorText = styled(Text)`
  font-style: italic;
`;
