import { faCheck, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Heading } from "grommet";
import * as React from "react";
import { ClockCardState } from "../../../state/CardState";
import BaseCard from "../base/BaseCard";
import { HorizontalClock } from "./HorizontalClock";
import { ClockFace } from "./ClockFace";
import { ConfigureClock } from "./ConfigureClock";
import { VerticalClock } from "./VerticalClock";
import { useIsCardPinned } from "../../hooks/useIsCardPinned";

export default function ClockCard(props: { card: ClockCardState }) {
  const [isConfigurable, setConfigurable] = React.useState(false);

  let innerComponent = <HorizontalClock card={props.card} />;

  if (isConfigurable) {
    innerComponent = (
      <ConfigureClock card={props.card} setConfigurable={setConfigurable} />
    );
  } else if (props.card.displayType === "radial") {
    innerComponent = <ClockFace card={props.card} />;
  } else if (props.card.displayType === "v-detail") {
    innerComponent = <VerticalClock card={props.card} />;
  }

  const isPinned = useIsCardPinned(props.card.cardId);

  return (
    <BaseCard
      cardState={props.card}
      commands={
        <Button
          aria-label="toggle-edit-mode"
          onClick={() => setConfigurable(!isConfigurable)}
          icon={<FontAwesomeIcon icon={isConfigurable ? faCheck : faCog} />}
        />
      }
    >
      {isPinned && (
        <Heading level="3" margin={{ left: "2em", vertical: "xsmall" }}>
          {props.card.title}
        </Heading>
      )}
      {innerComponent}
    </BaseCard>
  );
}
