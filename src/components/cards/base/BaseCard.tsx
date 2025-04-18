import { Box, ThemeContext } from "grommet";
import _ from "lodash";
import React, { useContext, useEffect } from "react";
import { CardState } from "../../../state/CardState";
import { useHover } from "../../hooks/useHover";
import { themeColor } from "../../hooks/useThemeColor";
import { useToast } from "../../hooks/useToast";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";
import { UIContext } from "../../UIContext";

export default function BaseCard(props: {
  commands: React.ReactNode;
  cardState: CardState;
  children: React.ReactNode;
  centerRow?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onPaste?: (event: React.ClipboardEvent) => void;
  innerBoxRef?: React.RefObject<HTMLDivElement>;
}) {
  const [toast, popToast] = useToast(5000);
  const [isFocused, setFocused] = React.useState(false);
  const { ref: hoverRef, hovered: isHovered } = useHover<HTMLDivElement>();
  const { cardRefsById } = useContext(UIContext);

  useEffect(() => {
    cardRefsById[props.cardState.cardId] = hoverRef;
    return () => {
      delete cardRefsById[props.cardState.cardId];
    };
  }, [props.cardState.cardId, cardRefsById, hoverRef]);

  const cardColor = props.cardState.themeColor;
  const theme = _.cloneDeep(React.useContext(ThemeContext));
  if (cardColor && cardColor !== "brand") {
    if (cardColor === "custom" && !props.cardState.customColor) {
      console.warn("cardState.themeColor is custom but no customColor is set.");
    }

    const finalColor =
      cardColor === "custom"
        ? props.cardState.customColor
        : themeColor(theme, cardColor);
    _.set(theme, `global.colors.brand.light`, finalColor);
  }

  return (
    <ThemeContext.Provider value={theme}>
      <Box
        tabIndex={0}
        fill
        elevation="medium"
        border={{ color: isFocused ? "focus" : "transparent", size: "small" }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        background="background"
        onKeyDown={props.onKeyDown}
        onPaste={props.onPaste}
        className={`card__${props.cardState.type}`}
        ref={hoverRef}
      >
        <CardHeader
          popToast={popToast}
          cardState={props.cardState}
          showAllButtons={isFocused || isHovered}
        />
        <Box
          ref={props.innerBoxRef}
          flex
          pad="xxsmall"
          direction={props.centerRow ? "row" : undefined}
          justify={props.centerRow ? "center" : undefined}
        >
          {props.children}
        </Box>
        <CardFooter
          toast={toast}
          cardState={props.cardState}
          commands={props.commands}
        />
      </Box>
    </ThemeContext.Provider>
  );
}
