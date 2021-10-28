import { faMousePointer, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import React, { useRef, useState } from "react";
import { DrawingCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { SketchFieldProps } from "./SketchFieldProps";

const {
  Tools,
  SketchField,
}: {
  Tools: Record<string, string>;
  SketchField: React.FC<SketchFieldProps>;
} = require("react-sketch2");

export function DrawingCard(props: { card: DrawingCardState }) {
  const [tool, setTool] = useState(Tools.Pencil);
  const sketch = useRef(null);
  return (
    <BaseCard
      cardState={props.card}
      commands={
        <>
          <Button
            onClick={() => setTool(Tools.Select)}
            icon={<FontAwesomeIcon icon={faMousePointer} />}
            active={tool === Tools.Select}
          />
          <Button
            onClick={() => setTool(Tools.Pencil)}
            icon={<FontAwesomeIcon icon={faPen} />}
            active={tool === Tools.Pencil}
          />
        </>
      }
    >
      <SketchField
        tool={tool}
        onChange={(e: any) => console.log(sketch.current)}
        ref={sketch}
      />
    </BaseCard>
  );
}
