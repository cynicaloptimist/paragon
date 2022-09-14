import { Box, CheckBoxGroup, Heading, Layer, Text } from "grommet";
import { useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardTypeFriendlyNames } from "../../state/CardTypeFriendlyNames";
import { UIContext } from "../UIContext";

export function AppSettings() {
  const uiContext = useContext(UIContext);
  const { state } = useContext(ReducerContext);
  const closeSettings = () => uiContext.setAppSettingsVisible(false);

  const availableCardTypes = Object.keys(CardTypeFriendlyNames).filter(
    (cardType) => {
      if (cardType === "info") {
        return false;
      }

      if (cardType === "pdf") {
        return state.user.hasStorage;
      }

      return true;
    }
  );

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
        <Heading level="3" margin="xsmall">
          App Settings
        </Heading>
        <Text>Display in New Card menu:</Text>
        <CheckBoxGroup
          margin="small"
          options={availableCardTypes}
          value={availableCardTypes}
        />
      </Box>
    </Layer>
  );
}
