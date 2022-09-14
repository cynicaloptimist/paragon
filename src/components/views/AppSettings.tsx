import { Box, CheckBoxGroup, Heading, Layer, Text } from "grommet";
import { useContext } from "react";
import { Actions } from "../../actions/Actions";
import { ReducerContext } from "../../reducers/ReducerContext";
import {
  CardTypeFriendlyNames,
  CardTypes,
} from "../../state/CardTypeFriendlyNames";
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
        <Text margin="xsmall">Display in New Card menu:</Text>
        <CheckBoxGroup
          margin="xsmall"
          options={availableCardTypes}
          value={state.appSettings.cardTypesInMenu}
          onChange={(changeEvent) => {
            const selectedOptions = changeEvent?.value as unknown as string[];
            dispatch(
              Actions.SetCardTypesInMenu({ cardTypes: selectedOptions })
            );
          }}
        />
      </Box>
    </Layer>
  );
}
