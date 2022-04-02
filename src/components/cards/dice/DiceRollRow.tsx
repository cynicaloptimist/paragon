import { faArrowRight, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, BoxExtendedProps, Button, Text } from "grommet";
import { DiceRoll } from "../../../state/CardState";

export function DiceRollRow(props: {
  roll: DiceRoll;
  rollDice: (expression: string) => void;
}) {
  const containerProps: BoxExtendedProps = {
    flex: false,
    direction: "row",
    border: "top",
    height: "3em",
  };

  const nameDisplay = props.roll.userName ? `${props.roll.userName}: ` : "";

  const noDiceRolled = !props.roll.result.includes("[");
  if (noDiceRolled && props.roll.total === 0) {
    return (
      <Box {...containerProps} align="center">
        <Text>
          {nameDisplay}
          {props.roll.expression}
        </Text>
      </Box>
    );
  }

  return (
    <Box {...containerProps}>
      <Box fill justify="center">
        <Text>
          {nameDisplay}
          {props.roll.expression}
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{ padding: "0 5px 1px" }}
          />
          {props.roll.result}
          {" = "}
          <strong>{props.roll.total}</strong>
        </Text>
      </Box>
      <Button
        margin="xxsmall"
        color="light-6"
        hoverIndicator={{ color: "auto" }}
        onClick={() => props.rollDice(props.roll.expression)}
        icon={<FontAwesomeIcon icon={faRedo} size="xs" />}
      />
    </Box>
  );
}
