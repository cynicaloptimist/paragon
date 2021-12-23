import { faArrowRight, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Text } from "grommet";
import { DiceRoll } from "../../../state/CardState";

export function DiceRollRow(props: {
  roll: DiceRoll;
  rollDice: (expression: string) => void;
}) {
  return (
    <Box flex={false} direction="row" border="top">
      <Box fill justify="center">
        <Text>
          {props.roll.expression}
          <FontAwesomeIcon
            icon={faArrowRight}
            style={{ padding: "0 5px 1px" }} />
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
        icon={<FontAwesomeIcon icon={faRedo} size="xs" />} />
    </Box>
  );
}
