import {
  faCircle,
  faPalette,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Drop } from "grommet";
import _ from "lodash";
import React from "react";
import SketchPicker from "react-color/lib/components/sketch/Sketch";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";

const themeColors = ["brand", "accent-1", "accent-2", "accent-3"];

export function CardColorPickerButton(props: {
  cardId: string;
}): React.ReactElement {
  const { state, dispatch } = React.useContext(ReducerContext);
  const buttonRef = React.useRef(null);
  const [isColorPickerOpen, setColorPickerOpen] =
    React.useState<boolean>(false);
  const card = state.cardsById[props.cardId];

  return (
    <>
      <Button
        icon={<FontAwesomeIcon icon={faPalette} />}
        onClick={() => setColorPickerOpen(!isColorPickerOpen)}
        ref={buttonRef}
      />
      {isColorPickerOpen && (
        <Drop
          onClickOutside={() => setColorPickerOpen(false)}
          target={buttonRef.current ?? undefined}
          background="background"
          align={{ top: "bottom" }}
        >
          <Box direction="row">
            {themeColors.map((themeColor) => (
              <Button
                plain
                style={{ padding: "4px" }}
                key={themeColor}
                color={themeColor}
                icon={<FontAwesomeIcon icon={faCircle} />}
                onClick={() =>
                  dispatch(
                    CardActions.SetThemeColor({
                      cardId: props.cardId,
                      themeColor,
                    })
                  )
                }
              />
            ))}
            {state.user.hasEpic && (
              <CustomColorPicker
                color={card.customColor ?? "#000000"}
                setColor={(color) => {
                  dispatch(
                    CardActions.SetCustomColor({
                      cardId: props.cardId,
                      customColor: color,
                    })
                  );
                }}
              />
            )}
          </Box>
        </Drop>
      )}
    </>
  );
}

function CustomColorPicker(props: {
  color: string;
  setColor: (color: string) => void;
}) {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { state } = React.useContext(ReducerContext);
  const existingCustomColors = _.uniq(
    Object.values(state.cardsById)
      .filter((c) => !!c.customColor)
      .map((c) => c.customColor as string)
  );

  return (
    <>
      {isOpen && buttonRef.current && (
        <Drop
          target={buttonRef.current}
          align={{ top: "bottom", right: "right" }}
          onClickOutside={() => setIsOpen(false)}
        >
          <SketchPicker
            color={props.color}
            disableAlpha
            presetColors={[...existingCustomColors]}
            onChangeComplete={(colorResult) => {
              props.setColor(colorResult.hex);
            }}
          />
        </Drop>
      )}
      <Button
        ref={buttonRef}
        plain
        style={{ padding: "4px" }}
        active={isOpen}
        key="colorPicker"
        onClick={() => setIsOpen(!isOpen)}
        icon={<FontAwesomeIcon color={props.color} icon={faPlusCircle} />}
      />
    </>
  );
}
