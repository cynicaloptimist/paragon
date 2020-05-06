import * as React from "react";
import { ReducerContext } from "./ReducerContext";
import { BaseCard } from "./BaseCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button, RangeInput } from "grommet";
import { ClockCardState } from "./AppState";

export function ClockCard(props: { card: ClockCardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const { card } = props;

  const [isConfigurable, setConfigurable] = React.useState(false);

  return (
    <BaseCard
      cardId={card.cardId}
      commands={
        <Button
          aria-label="toggle-edit-mode"
          onClick={() => setConfigurable(!isConfigurable)}
          icon={
            <FontAwesomeIcon
              size="xs"
              icon={isConfigurable ? faCheck : faEdit}
            />
          }
        />
      }
    >
      {isConfigurable ? "Configure" : <RangeInput />}
    </BaseCard>
  );
}
