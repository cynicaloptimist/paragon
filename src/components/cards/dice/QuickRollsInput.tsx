import { Button, TextArea } from "grommet";
import { useContext, useRef } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { DiceCardState } from "../../../state/CardState";
import { BaseCard } from "../BaseCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEraser } from "@fortawesome/free-solid-svg-icons";
import { defaultQuickRolls } from "./DiceCard";

export function QuickRollsInput(props: {
  card: DiceCardState;
  done: () => void;
}) {
  const { dispatch } = useContext(ReducerContext);
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
          tip="Save Quick Rolls"
        />,
      ]}
    >
      <TextArea fill ref={inputRef} defaultValue={inputDefaultValue} />
    </BaseCard>
  );
}
