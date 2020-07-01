import React, { useState, useContext, useRef, useLayoutEffect } from "react";
import { RollTableCardState, RollTableEntry } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { Button, Box, TextArea } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faDice } from "@fortawesome/free-solid-svg-icons";
import { ReducerContext } from "../reducers/ReducerContext";
import { Actions } from "../actions/Actions";

export function RollTableCard(props: { card: RollTableCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const [isConfigurable, setConfigurable] = useState(false);
  const rollTableModel = GetRollTableModel(card, card.lastRoll || 0);

  return (
    <BaseCard
      cardId={card.cardId}
      commands={
        <>
          <Button
            onClick={() =>
              dispatch(
                Actions.SetRollTableLastRoll({
                  cardId: card.cardId,
                  rollResult: RandomInt(rollTableModel.dieSize),
                })
              )
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
        <RollTableConfiguration rollTableModel={rollTableModel} />
      ) : (
        <RollTable rollTableModel={rollTableModel} />
      )}
    </BaseCard>
  );
}

function RollTable(props: { rollTableModel: RollTableModel }) {
  const rolledElement = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    rolledElement.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.rollTableModel.rollResult]);

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
              ref={entry.isRolled ? rolledElement : undefined}
            >
              <Box flex={false} width="xsmall" align="center">
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

function RollTableConfiguration(props: { rollTableModel: RollTableModel }) {
  const { dispatch } = useContext(ReducerContext);

  const inputText = props.rollTableModel.entries
    .map((entry) => `|${entry.diceRange}|${entry.content}|`)
    .join("\n");
  return (
    <TextArea
      fill
      style={{ fontFamily: "monospace" }}
      defaultValue={inputText}
      onBlur={(e) => {
        const entries = GetRollTableEntriesFromMarkdown(e.target.value);
        dispatch(
          Actions.SetRollTableEntries({
            cardId: props.rollTableModel.cardId,
            entries,
          })
        );
      }}
    />
  );
}

function GetRollTableEntriesFromMarkdown(
  markdownString: string
): RollTableEntry[] {
  const entries = markdownString
    .split("\n")
    .map((line) => {
      //Parse this format, from a markdown table: |range|content|
      const lineMatches = line.match(/\|([^|]+)\|([^|]+)\|/);

      if (lineMatches === null || lineMatches[2] === null) {
        return null;
      }

      return {
        weight: GetWeight(lineMatches[1]),
        content: lineMatches[2],
      };
    })
    .filter((entry): entry is RollTableEntry => entry != null);

  return entries;
}

function GetWeight(diceRange: string) {
  const rangeMatches = diceRange.match(/(\d+)(\s*-\s*(\d+))?/);
  if (rangeMatches === null) {
    return 1;
  }

  if (rangeMatches[3] === undefined) {
    return 1;
  }

  try {
    const rangeFloor = parseInt(rangeMatches[1]);
    const rangeCeiling = parseInt(rangeMatches[3]);
    return rangeCeiling - rangeFloor + 1;
  } catch (_) {
    return 1;
  }
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
    cardId: card.cardId,
    dieSize: runningTotal,
    rollResult,
    entries,
  };
}

type RollTableModel = {
  cardId: string;
  dieSize: number;
  rollResult: number;
  entries: {
    content: string;
    weight: number;
    diceRangeFloor: number;
    diceRangeCeiling: number;
    diceRange: string;
    isRolled: boolean;
  }[];
};
