import { faMousePointer, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import _ from "lodash";
import React, { useRef, useState } from "react";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { DrawingCardState } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { SketchFieldProps, SketchModel } from "./SketchFieldProps";

const {
  Tools,
  SketchField,
}: {
  Tools: Record<string, string>;
  SketchField: React.FC<SketchFieldProps>;
} = require("react-sketch2");

export function DrawingCard(props: { card: DrawingCardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const [tool, setTool] = useState(Tools.Pencil);
  const sketch = useRef<any>(null);

  const onSketchChange = (checkOperation?: string) => {
    if (!sketch.current) {
      return;
    }

    const sketchModel = sketch.current.toJSON();

    if (props.card.sketchJSON) {
      const previousSketchModel = JSON.parse(
        props.card.sketchJSON
      ) as SketchModel;
      const previousObjectCount = previousSketchModel.objects?.length || 0;
      if (
        checkOperation === "added" &&
        sketchModel.objects.length <= previousObjectCount
      ) {
        return;
      }
      if (
        checkOperation === "removed" &&
        sketchModel.objects.length >= previousObjectCount
      ) {
        return;
      }
      if (
        checkOperation === "modified" &&
        sketchModel.objects.length !== previousObjectCount
      ) {
        return;
      }
    }

    const newSketchJSON = JSON.stringify(sketchModel);
    if (!_.isEqual(newSketchJSON, props.card.sketchJSON)) {
      dispatch(
        CardActions.SetSketchJSON({
          cardId: props.card.cardId,
          sketchJSON: newSketchJSON,
        })
      );
    }
  };

  const sketchModel = JSON.parse(props.card.sketchJSON || "{}");

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
      <Box
        tabIndex={0}
        onKeyDown={(keyEvent) => {
          if (keyEvent.key === "Delete") {
            sketch.current?.removeSelected();
            onSketchChange();
          }
        }}
      >
        <SketchField
          tool={tool}
          value={sketchModel}
          onObjectAdded={() => onSketchChange("added")}
          onObjectModified={() => onSketchChange("modified")}
          onObjectRemoved={() => onSketchChange("removed")}
          ref={sketch}
        />
      </Box>
    </BaseCard>
  );
}
