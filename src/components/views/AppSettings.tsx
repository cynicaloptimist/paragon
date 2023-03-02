import { Box, CheckBoxGroup, Layer, Tab, Tabs, Text } from "grommet";
import { useContext } from "react";
import styled from "styled-components";
import { Actions } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import {
  CardType,
  CardTypeFriendlyNames,
  CardTypes,
} from "../../state/CardTypes";
import { UIContext } from "../UIContext";
import { ExportImportControls } from "./ExportImportControls";

export function AppSettings() {
  const uiContext = useContext(UIContext);
  const closeSettings = () => uiContext.setAppSettingsVisible(false);

  return (
    <Layer
      onClickOutside={closeSettings}
      onEsc={closeSettings}
      position="center"
    >
      <Box
        background="background"
        pad="small"
        style={{ width: "400px", height: "600px" }}
        alignContent="center"
        elevation="medium"
        overflow={{ vertical: "auto" }}
      >
        <Tabs>
          <Tab title="Data and Info">
            <DataSettingsAndInfo />
          </Tab>
          <Tab title="Card Types">
            <CardTypesSettings />
          </Tab>
          <Tab title="Templates"></Tab>
        </Tabs>
      </Box>
    </Layer>
  );
}

function DataSettingsAndInfo() {
  return (
    <InnerBox>
      <ExportImportControls />
      <AppInfo />
    </InnerBox>
  );
}

function CardTypesSettings() {
  const { state, dispatch } = useContext(ReducerContext);
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
    <InnerBox>
      <Text margin="xsmall">Show in New Card menu:</Text>
      <CheckBoxGroup
        margin="xsmall"
        flex={false}
        options={availableCardTypes}
        value={state.appSettings.cardTypesInMenu}
        onChange={(changeEvent) => {
          const selectedOptions = changeEvent?.value as unknown as CardType[];
          dispatch(Actions.SetCardTypesInMenu({ cardTypes: selectedOptions }));
        }}
      />
    </InnerBox>
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

const InnerBox = styled(Box)`
  width: 300px;
  margin: auto;
`;
