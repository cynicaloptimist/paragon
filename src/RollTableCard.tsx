import React, { useState } from "react";
import { RollTableCardState, RollTableEntries } from "./CardState";
import { BaseCard } from "./BaseCard";
import {
  Button,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faDice } from "@fortawesome/free-solid-svg-icons";

export function RollTableCard(props: { card: RollTableCardState }) {
  const { card } = props;

  const [isConfigurable, setConfigurable] = useState(false);

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
      {isConfigurable ? "Configure" : <RollTable entries={card.entries} />}
    </BaseCard>
  );
}

function RollTable(props: { entries: RollTableEntries }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell scope="col" border="bottom">
            <FontAwesomeIcon icon={faDice} />
          </TableCell>
          <TableCell scope="col" border="bottom">
            Result
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.entries.map((entry, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{entry.weight}</TableCell>
              <TableCell scope="row">{entry.content}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
