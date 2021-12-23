import { TextArea } from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { GetRollTableEntriesFromMarkdown } from "./GetRollTableEntriesFromMarkdown";
import { RollTableModel } from "./GetRollTableModel";

export function RollTableConfiguration(props: {
  rollTableModel: RollTableModel;
}) {
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
          CardActions.SetRollTableEntries({
            cardId: props.rollTableModel.cardId,
            entries,
          })
        );
      }}
    />
  );
}
