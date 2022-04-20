import { Box, Footer } from "grommet";
import React, { useContext } from "react";
import { CardState, PlayerViewPermission } from "../../../state/CardState";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { ComputeThemeProps } from "./ComputeThemeProps";

export function CardFooter(props: {
  toast: string | null;
  commands: React.ReactNode;
  cardState: CardState;
}) {
  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    props.cardState.playerViewPermission === PlayerViewPermission.Interact;

  const themeProps = ComputeThemeProps(props.cardState);

  return (
    <Footer
      justify="stretch"
      pad={{ right: "small" }}
      overflow={{ horizontal: "auto" }}
      gap="xsmall"
      {...themeProps}
    >
      <Box height="1em" />
      {props.toast && (
        <Box
          flex="grow"
          pad={{ horizontal: "small" }}
          animation={{ type: "fadeIn", duration: 500 }}
        >
          {props.toast}
        </Box>
      )}
      <Box fill />
      {canEdit && props.commands}
    </Footer>
  );
}
