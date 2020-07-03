import React from "react";

import { DiceCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { Button } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";

export function DiceCard(props: { card: DiceCardState }) {
  const { card } = props;

  return (
    <BaseCard
      cardId={card.cardId}
      commands={
        <>
          <Button icon={<FontAwesomeIcon size="xs" icon={faDice} />} />
        </>
      }
    >
      Dice
    </BaseCard>
  );
}
