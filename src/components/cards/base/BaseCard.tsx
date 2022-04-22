import { Box } from "grommet";
import React from "react";
import { CardState } from "../../../state/CardState";
import { useToast } from "../../hooks/useToast";
import { CardFooter } from "./CardFooter";
import { CardHeader } from "./CardHeader";

export function BaseCard(props: {
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

  return (
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
    >
      <CardHeader popToast={popToast} cardState={props.cardState} />
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
  );
}
