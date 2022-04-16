import { faGripLines, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  BoxProps,
  Button,
  Footer,
  Header,
  Heading,
  TextInput,
} from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardState, PlayerViewPermission } from "../../state/CardState";
import { useToast } from "../hooks/useToast";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";
import { CardColorPickerButton } from "./CardColorPickerButton";
import { PlayerViewButton } from "./PlayerViewButton";

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

  return (
    <Box
      tabIndex={0}
      fill
      elevation="medium"
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

function ComputeThemeProps(cardState: CardState): BoxProps {
  const props = {
    border: { color: cardState.themeColor ?? "brand", size: "medium" },
    background: cardState.themeColor ?? "brand",
  };

  if (cardState.themeColor === "custom") {
    if (!cardState.customColor) {
      console.warn("cardState.themeColor is custom but no customColor is set.");
    }
    props.border.color = cardState.customColor ?? "brand";
    props.background = cardState.customColor ?? "brand";
  }

  if (cardState.playerViewPermission === PlayerViewPermission.Hidden) {
    props.background = "background";
  }

  return props;
}

function CardHeader(props: {
  cardState: CardState;
  popToast: (toast: string) => void;
}) {
  const { dispatch } = React.useContext(ReducerContext);
  const [isHeaderEditable, setHeaderEditable] = React.useState<boolean>(false);
  const [headerInput, setHeaderInput] = React.useState<string>("");
  const saveAndClose = () => {
    if (headerInput.length > 0) {
      dispatch(
        CardActions.SetCardTitle({
          cardId: props.cardState.cardId,
          title: headerInput,
        })
      );
    }
    setHeaderEditable(false);
  };
  const viewType = useContext(ViewTypeContext);
  const isGmView = viewType === ViewType.GameMaster;
  const isDashboardView = viewType === ViewType.Dashboard;

  const themeProps = ComputeThemeProps(props.cardState);

  return (
    <Header pad="xsmall" height="3.4rem" {...themeProps}>
      <Box
        fill
        className="drag-handle"
        direction="row"
        gap="xxsmall"
        align="center"
      >
        <Button icon={<FontAwesomeIcon icon={faGripLines} />} />
        {isHeaderEditable ? (
          <TextInput
            placeholder={props.cardState.title}
            onChange={(changeEvent) => setHeaderInput(changeEvent.target.value)}
            onKeyDown={(keyEvent) => {
              if (keyEvent.key === "Enter") {
                saveAndClose();
              }
            }}
            autoFocus
            onBlur={saveAndClose}
          />
        ) : (
          <Box
            fill
            direction="row"
            onDoubleClick={() =>
              (isGmView || isDashboardView) && setHeaderEditable(true)
            }
            align="center"
          >
            <Heading level={3} margin="none" truncate>
              {props.cardState.title}
            </Heading>
          </Box>
        )}
        {isGmView && <CardColorPickerButton cardId={props.cardState.cardId} />}
        {isGmView && (
          <PlayerViewButton
            cardState={props.cardState}
            popToast={props.popToast}
          />
        )}
        {(isGmView || isDashboardView) && (
          <Button
            icon={<FontAwesomeIcon icon={faTimes} />}
            onClick={() =>
              dispatch(
                CardActions.CloseCard({ cardId: props.cardState.cardId })
              )
            }
          />
        )}
      </Box>
    </Header>
  );
}

function CardFooter(props: {
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
