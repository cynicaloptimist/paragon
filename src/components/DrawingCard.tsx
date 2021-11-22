import {
  faCircle as faCircleSolid,
  faMousePointer,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Drop } from "grommet";
import _ from "lodash";
import React, { useContext, useRef, useState } from "react";
import { SketchPicker } from "react-color";

import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { DrawingCardState, PlayerViewPermission } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import {
  SketchFieldProps,
  SketchModel,
  SketchModelJSON,
  ToolsEnum,
} from "./SketchFieldProps";
import { ViewTypeContext, ViewType } from "./ViewTypeContext";

type Size = { height: number; width: number };

const {
  Tools,
  SketchField,
}: {
  Tools: ToolsEnum;
  SketchField: React.FC<SketchFieldProps>;
} = require("react-sketch2");

export function DrawingCard(props: {
  card: DrawingCardState;
  outerSize: Size;
}) {
  const { dispatch } = React.useContext(ReducerContext);
  const [activeTool, setActiveTool] = useState<string>(Tools.Pencil);
  const [color, setColor] = useState<string>("#000000");

  const boxRef = React.useRef<HTMLDivElement>(null);
  const [innerSize, setInnerSize] = React.useState<Size>({
    height: 0,
    width: 0,
  });
  const sketch = useRef<any>(null);
  const viewType = useContext(ViewTypeContext);

  React.useEffect(() => {
    if (!boxRef.current) {
      return;
    }
    const box = boxRef.current;
    setInnerSize(box.getBoundingClientRect());
  }, [boxRef, props.outerSize]);

  const canEdit =
    viewType !== ViewType.Player ||
    props.card.playerViewPermission === PlayerViewPermission.Interact;

  const onSketchChange = () => {
    if (!sketch.current) {
      return;
    }

    const newSketchModel: SketchModel = sketch.current.toJSON();

    // The sketch objects must be stringified to preserve null values in Firebase.
    const newSketchJSON: SketchModelJSON = {
      ...newSketchModel,
      objectJSONs: newSketchModel.objects.map((object: any) =>
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
    objects: (props.card.sketchModel?.objectJSONs || []).map(
      (object) => JSON.parse(object) || []
    ),
  };

  const tools = [
    {
      name: Tools.Select,
      icon: faMousePointer,
    },
    { name: Tools.Pencil, icon: faPen },
    { name: Tools.Rectangle, icon: faSquare },
    { name: Tools.Circle, icon: faCircle },
  ];

  return (
    <BaseCard
      cardState={props.card}
      commands={
        <>
          <ColorPickerButton color={color} setColor={setColor} />
          {tools.map((tool) => (
            <Button
              key={tool.name}
              onClick={() => setActiveTool(tool.name)}
              icon={<FontAwesomeIcon icon={tool.icon} />}
              active={activeTool === tool.name}
            />
          ))}
        </>
      }
    >
      <Box
        fill
        ref={boxRef}
        tabIndex={0}
        onKeyDown={(keyEvent) => {
          if (keyEvent.key === "Delete") {
            sketch.current?.removeSelected();
          }
          onSketchChange();
        }}
        onMouseUp={() => setImmediate(() => onSketchChange())}
      >
        <SketchField
          tool={canEdit ? activeTool : Tools.Pan}
          lineColor={color}
          value={sketchModel}
          ref={sketch}
          width={innerSize.width}
          height={innerSize.height}
        />
      </Box>
    </BaseCard>
  );
}

function ColorPickerButton(props: {
  color: string;
  setColor: (color: string) => void;
}) {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {isOpen && buttonRef.current && (
        <Drop
          target={buttonRef.current}
          align={{ bottom: "top", right: "right" }}
        >
          <SketchPicker
            color={props.color}
            onChange={(colorResult) => {
              props.setColor(colorResult.hex);
            }}
          />
        </Drop>
      )}
      <Button
        ref={buttonRef}
        active={isOpen}
        key="colorPicker"
        onClick={() => setIsOpen(!isOpen)}
        icon={<FontAwesomeIcon color={props.color} icon={faCircleSolid} />}
      />
    </>
  );
}
