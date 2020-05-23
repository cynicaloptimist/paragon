import React, { useState } from "react";
import { RollTableCardState } from "./CardState";
import { BaseCard } from "./BaseCard";
import { Button, Box } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faDice } from "@fortawesome/free-solid-svg-icons";

export function RollTableCard(props: { card: RollTableCardState }) {
  const { card } = props;

  const [isConfigurable, setConfigurable] = useState(false);
  const [rollResult, setRollResult] = useState(0);
  const rollTableModel = GetRollTableModel(card, rollResult);

  return (
    <BaseCard
      cardId={card.cardId}
      commands={
        <>
          <Button
            onClick={() => setRollResult(RandomInt(rollTableModel.dieSize))}
            icon={<FontAwesomeIcon size="xs" icon={faDice} />}
          />
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
        </>
      }
    >
      {isConfigurable ? (
        "Configure"
      ) : (
        <RollTable rollTableModel={rollTableModel} />
      )}
    </BaseCard>
  );
}

function RollTable(props: { rollTableModel: RollTableModel }) {
  return (
    <Box>
      <Box
        direction="row"
        flex="grow"
        pad={{ vertical: "xsmall" }}
        style={{ fontWeight: "bold", borderBottom: "1px solid" }}
      >
        <Box width="xsmall" align="center">
          1d{props.rollTableModel.dieSize}
        </Box>
        <Box>Result</Box>
      </Box>
      <Box overflow="auto">
        {props.rollTableModel.entries.map((entry, index) => {
          return (
            <Box
              key={index}
              direction="row"
              flex="grow"
              background={entry.isRolled ? "brand-2" : "background"}
            >
              <Box width="xsmall" align="center">
                {entry.diceRange}
              </Box>
              <Box>{entry.content}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function RandomInt(max: number) {
  return Math.ceil(Math.random() * max);
}

function GetRollTableModel(
  card: RollTableCardState,
  rollResult: number
): RollTableModel {
  let runningTotal = 0;
  const entries = card.entries.map((entry) => {
    
    runningTotal += entry.weight;
    const diceRangeFloor = runningTotal - entry.weight + 1;
    const diceRangeCeiling = runningTotal;

    const diceRange =
      entry.weight === 1
        ? diceRangeCeiling.toString()
        : `${diceRangeFloor} - ${diceRangeCeiling}`;

    return {
      ...entry,
      diceRangeFloor,
      diceRangeCeiling,
      diceRange,
      isRolled: rollResult >= diceRangeFloor && rollResult <= diceRangeCeiling,
    };
  });
  return {
    dieSize: runningTotal,
    entries,
  };
}

type RollTableModel = {
  dieSize: number;
  entries: {
    content: string;
    weight: number;
    diceRangeFloor: number;
    diceRangeCeiling: number;
    diceRange: string;
    isRolled: boolean;
  }[];
};
