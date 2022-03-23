import { faCircle, faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Drop } from "grommet";
import React from "react";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";

export function CardColorPickerButton(props: {
  cardId: string;
}): React.ReactElement {
  const { dispatch } = React.useContext(ReducerContext);
  const buttonRef = React.useRef(null);
  const [isColorPickerOpen, setColorPickerOpen] =
    React.useState<boolean>(false);
  const themeColors = ["brand", "accent-1", "accent-2", "accent-3"];

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
          </Box>
        </Drop>
      )}
    </>
  );
}
