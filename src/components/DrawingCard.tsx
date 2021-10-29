import { faMousePointer, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import _ from "lodash";
import React, { useContext, useRef, useState } from "react";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { DrawingCardState, PlayerViewPermission } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import {
  SketchFieldProps,
  SketchModel,
  SketchModelJSON,
} from "./SketchFieldProps";
import { ViewTypeContext, ViewType } from "./ViewTypeContext";

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
  const viewType = useContext(ViewTypeContext);

  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  const onSketchChange = (checkOperation?: string) => {
    if (!sketch.current) {
      return;
    }

    const sketchModel: SketchModel = sketch.current.toJSON();

    if (props.card.sketchModel) {
      const previousSketchModel: SketchModel = {
        ...props.card.sketchModel,
        objects: props.card.sketchModel.objectJSONs.map((object) =>
          JSON.parse(object)
        ),
      };
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

    // The sketch objects must be stringified to preserve null values in Firebase.
    const newSketchJSON: SketchModelJSON = {
      ...sketchModel,
      objectJSONs: sketchModel.objects.map((object: any) =>
        JSON.stringify(object)
      ),
    };

    if (!_.isEqual(newSketchJSON, props.card.sketchModel)) {
      dispatch(
        CardActions.SetSketchModel({
          cardId: props.card.cardId,
          sketchJSON: newSketchJSON,
        })
      );
    }
  };

  const sketchModel = {
    ...props.card.sketchModel,
    objects: props.card.sketchModel?.objectJSONs.map(
      (object) => JSON.parse(object) || []
    ),
  };

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
          tool={canEdit ? tool : Tools.Pan}
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
