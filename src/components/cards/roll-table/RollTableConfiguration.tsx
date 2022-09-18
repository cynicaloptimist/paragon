import { TextArea } from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import {
  GetRollTableEntriesFromCommaSeparatedList,
  GetRollTableEntriesFromMarkdown,
} from "./GetRollTableEntriesFromMarkdown";
import { RollTableModel } from "./GetRollTableModel";

const configurationInfoText = `You can format like a Markdown table:

  |rolls|entry|

Or input a comma-separated list for a simple table

  entry1,entry2,entry3
`;

export function RollTableConfiguration(props: {
  rollTableModel: RollTableModel;
}) {
  const { dispatch } = useContext(ReducerContext);

  const inputText = props.rollTableModel.entries
    .map((entry) => `|${entry.diceRange}|${entry.content}|`)
    .join("\n");
  return (
    <TextArea
      placeholder={configurationInfoText}
      fill
      style={{ fontFamily: "monospace" }}
      defaultValue={inputText}
      onBlur={(e) => {
        let entries = GetRollTableEntriesFromMarkdown(e.target.value);
        if (entries.length === 0) {
          entries = GetRollTableEntriesFromCommaSeparatedList(e.target.value);
        }
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
