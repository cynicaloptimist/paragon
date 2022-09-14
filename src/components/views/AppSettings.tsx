import { Box, CheckBoxGroup, Heading, Layer, Text } from "grommet";
import { useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardTypeFriendlyNames } from "../../state/CardTypeFriendlyNames";
import { UIContext } from "../UIContext";

export function AppSettings() {
  const uiContext = useContext(UIContext);
  const { state } = useContext(ReducerContext);
  const closeSettings = () => uiContext.setAppSettingsVisible(false);

  const availableCardTypes = Object.keys(CardTypeFriendlyNames)
    .filter((cardType) => {
      if (cardType === "info") {
        return false;
      }

      if (cardType === "pdf") {
        return state.user.hasStorage;
      }

      return true;
    })
    .map((cardType) => {
      return {
        label: CardTypeFriendlyNames[cardType],
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
        <CheckBoxGroup margin="xsmall" options={availableCardTypes} />
      </Box>
    </Layer>
  );
}
