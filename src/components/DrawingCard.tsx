import React from "react";
import { DrawingCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";


export function DrawingCard(props: { card: DrawingCardState }) {
  return (
    <BaseCard cardState={props.card} commands={null}>
      Drawing Card
    </BaseCard>
  );
}
