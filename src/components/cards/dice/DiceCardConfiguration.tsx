import { Box, Button, RangeInput, Text, TextArea } from "grommet";
import { useContext, useRef, useState } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { DiceCardState } from "../../../state/CardState";
import { BaseCard } from "../base/BaseCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEraser } from "@fortawesome/free-solid-svg-icons";
import { defaultQuickRolls } from "./DiceCard";

export function DiceCardConfiguration(props: {
  card: DiceCardState;
  done: () => void;
}) {
  const { dispatch } = useContext(ReducerContext);
  const [historyLength, setHistoryLength] = useState(20);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const quickRolls = props.card.quickRolls ?? defaultQuickRolls;
  const inputDefaultValue = quickRolls.join("\n");
  return (
    <BaseCard
      cardState={props.card}
      commands={[
        <Button
          icon={<FontAwesomeIcon icon={faEraser} />}
          onClick={() => {
            dispatch(
              CardActions.RevertToDefaultQuickRolls({
                cardId: props.card.cardId,
              })
            );
            props.done();
          }}
          tip="Reset to default Quick Rolls"
        />,
        <Button
          icon={<FontAwesomeIcon icon={faCheck} />}
          onClick={() => {
            if (!inputRef.current) {
              return;
            }
            const newQuickRolls = inputRef.current.value.split("\n");
            dispatch(
              CardActions.SetQuickRolls({
                cardId: props.card.cardId,
                quickRolls: newQuickRolls,
              })
            );
            props.done();
          }}
          tip="Save"
        />,
      ]}
    >
      <Box direction="row" align="center" gap="small">
        <Text style={{ fontWeight: "bold" }} margin="small">
          Lines of history shown
        </Text>
        <Box align="center" margin="small">
          <Text>{historyLength === 0 ? "unlimited" : 20 - historyLength}</Text>
          <RangeInput
            min={0}
            max={19}
            value={historyLength}
            onChange={(changeEvent) =>
              setHistoryLength(parseInt(changeEvent.target.value))
            }
          />
        </Box>
      </Box>
      <Box direction="row" flex="grow">
        <Text style={{ fontWeight: "bold" }} margin="small">
          Quick Rolls
        </Text>
        <TextArea fill ref={inputRef} defaultValue={inputDefaultValue} />
      </Box>
    </BaseCard>
  );
}
