import { Box, Button, FormField, TextInput } from "grommet";
import * as React from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { ClockCardDisplayType, ClockCardState } from "../../../state/CardState";

export function ConfigureClock(props: {
  card: ClockCardState;
  setConfigurable: (configurable: boolean) => void;
}) {
  const { dispatch } = React.useContext(ReducerContext);
  const { card, setConfigurable } = props;
  const setCardValue = React.useCallback(
    (value: number) =>
      dispatch(
        CardActions.SetClockValue({
          cardId: card.cardId,
          value,
        })
      ),
    [card.cardId, dispatch]
  );

  const setCardMax = React.useCallback(
    (max: number) =>
      dispatch(
        CardActions.SetClockMax({
          cardId: card.cardId,
          max,
        })
      ),
    [card.cardId, dispatch]
  );

  const setCardDisplayType = React.useCallback(
    (displayType: ClockCardDisplayType) => {
      dispatch(
        CardActions.SetClockDisplayType({
          cardId: card.cardId,
          displayType,
        })
      );
      setConfigurable(false);
    },
    [card.cardId, dispatch, setConfigurable]
  );

  return (
    <Box direction="column" overflow={{ vertical: "auto" }}>
      <Box direction="row" align="center" flex="grow">
        <FormField label="Current">
          <TextInput
            type="number"
            defaultValue={card.value}
            onBlur={(e) => setCardValue(parseInt(e.target.value))}
          />
        </FormField>
        <FormField label="Maximum">
          <TextInput
            type="number"
            defaultValue={card.max}
            onBlur={(e) => setCardMax(parseInt(e.target.value))}
          />
        </FormField>
      </Box>
      <Box direction="row" wrap align="center" justify="center">
        <Button
          label="Horizontal"
          active={card.displayType === "horizontal"}
          onClick={() => setCardDisplayType("horizontal")}
        />
        <Button
          label="Radial"
          active={card.displayType === "radial"}
          onClick={() => setCardDisplayType("radial")}
        />
        <Button
          label="Vertical Detail"
          active={card.displayType === "v-detail"}
          onClick={() => setCardDisplayType("v-detail")}
        />
      </Box>
    </Box>
  );
}
