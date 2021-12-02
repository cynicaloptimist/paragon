import { TextInput } from "grommet";
import React, { useState } from "react";

export function EditableText(props: {
  text: string;
  trySubmit: (newText: string) => boolean;
}) {
  const [isEditing, setEditing] = useState(false);
  const [input, setInput] = useState(props.text);
  const saveAndClose = () => {
    if (props.trySubmit(input)) {
      setEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <span
        style={{ whiteSpace: "nowrap" }}
        onDoubleClick={() => setEditing(true)}
      >
        {props.text}
      </span>
    );
  } else {
    return (
      <TextInput
        defaultValue={props.text}
        onChange={(changeEvent) => setInput(changeEvent.target.value)}
        onKeyDown={(keyEvent) => {
          if (keyEvent.key === "Enter") {
            saveAndClose();
          }
        }}
        autoFocus
        onBlur={saveAndClose}
      />
    );
  }
}
