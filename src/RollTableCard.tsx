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

  let runningTotal = 0;
  const entriesWithDiceRanges = card.entries.map((entry) => {
    runningTotal += entry.weight;
    const diceRangeFloor = runningTotal + 1 - entry.weight;
    const diceRange =
      entry.weight === 1
        ? runningTotal.toString()
        : `${diceRangeFloor} - ${runningTotal}`;

    return {
      content: entry.content,
      diceRange,
      isRolled: rollResult >= diceRangeFloor && rollResult <= runningTotal,
    };
  });

  return (
    <BaseCard
      cardId={card.cardId}
      commands={
        <>
          <Button
            onClick={() =>
              setRollResult(Math.ceil(Math.random() * runningTotal))
            }
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
        <RollTable dieSize={runningTotal} entries={entriesWithDiceRanges} />
      )}
    </BaseCard>
  );
}

function RollTable(props: {
  dieSize: number;
  entries: { content: string; diceRange: string; isRolled: boolean }[];
}) {
  return (
    <Box>
      <Box
        direction="row"
        flex="grow"
        pad={{ vertical: "xsmall" }}
        style={{ fontWeight: "bold", borderBottom: "1px solid" }}
      >
        <Box width="xsmall" align="center">
          1d{props.dieSize}
        </Box>
        <Box>Result</Box>
      </Box>
      <Box overflow="auto">
        {props.entries.map((entry, index) => {
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
