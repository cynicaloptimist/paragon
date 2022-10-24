import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import saveAs from "file-saver";
import { Box, Button, CheckBoxGroup, Heading, Layer, Text } from "grommet";
import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { Actions, RootAction } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { AppState } from "../../state/AppState";
import {
  CardType,
  CardTypeFriendlyNames,
  CardTypes,
} from "../../state/CardTypes";
import { UIContext } from "../UIContext";

export function AppSettings() {
  const uiContext = useContext(UIContext);
  const { state, dispatch } = useContext(ReducerContext);
  const closeSettings = () => uiContext.setAppSettingsVisible(false);

  const availableCardTypes = CardTypes.filter((cardType) => {
    if (cardType === "info") {
      return false;
    }

    if (cardType === "pdf") {
      return state.user.hasStorage;
    }

    return true;
  }).map((cardType) => {
    return {
      label: CardTypeFriendlyNames[cardType],
      value: cardType,
    };
  });

  return (
    <Layer
      onClickOutside={closeSettings}
      onEsc={closeSettings}
      position="center"
    >
      <Box
        background="background"
        pad="small"
        style={{ width: "300px" }}
        alignContent="center"
        elevation="medium"
        overflow={{ vertical: "auto" }}
      >
        <Heading margin="xsmall" level="3">
          App Settings
        </Heading>
        <Text margin="xsmall">Card Types in New Card menu:</Text>
        <CheckBoxGroup
          margin="xsmall"
          flex={false}
          options={availableCardTypes}
          value={state.appSettings.cardTypesInMenu}
          onChange={(changeEvent) => {
            const selectedOptions = changeEvent?.value as unknown as CardType[];
            dispatch(
              Actions.SetCardTypesInMenu({ cardTypes: selectedOptions })
            );
          }}
        />
        <ExportImportControls />
        <AppInfo />
      </Box>
    </Layer>
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

function ExportImportControls() {
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

function AppInfo() {
  return (
    <InfoText>
      {"Paragon Campaign Dashboard is funded on "}
      <LinkOut href="https://www.patreon.com/improvedinitiative">
        Patreon
      </LinkOut>
      {" and developed on "}
      <LinkOut href="https://github.com/cynicaloptimist/paragon/">
        Github
      </LinkOut>
      .
    </InfoText>
  );
}

const LinkOut = styled.a.attrs({ target: "_blank", rel: "noreferrer" })``;

const InfoText = styled(Text).attrs({ color: "text-fade" })`
  font-size: medium;
  flex-shrink: 0;
`;

const ErrorText = styled(Text)`
  font-style: italic;
`;
