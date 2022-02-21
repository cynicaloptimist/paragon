import {
  faCircle,
  faEye,
  faEyeSlash,
  faGripLines,
  faPalette,
  faPencilAlt,
  faTimes,
  faUserFriends,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  BoxProps,
  Button,
  Drop,
  Footer,
  Header,
  Heading,
  TextInput,
} from "grommet";
import React, { useContext, useRef } from "react";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardState, PlayerViewPermission } from "../../state/CardState";
import { useToast } from "../hooks/useToast";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";

export function BaseCard(props: {
  commands: React.ReactNode;
  cardState: CardState;
  children: React.ReactNode;
  centerRow?: boolean;
}) {
  const [toast, popToast] = useToast(5000);

  const innerBoxRef = useRef<HTMLDivElement>(null);

  return (
    <Box fill elevation="medium" background="background">
      <CardHeader popToast={popToast} cardState={props.cardState} />
      <Box
        ref={innerBoxRef}
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
  let props: BoxProps = {
    border: { color: cardState.themeColor ?? "brand", size: "medium" },
    background: cardState.themeColor ?? "brand",
  };

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
        {isGmView && <ColorPickerButton cardId={props.cardState.cardId} />}
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

function ColorPickerButton(props: { cardId: string }): React.ReactElement {
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

function PlayerViewIcon(props: { topLayer: IconDefinition }) {
  return (
    <span className="fa-layers fa-fw">
      <FontAwesomeIcon icon={props.topLayer} transform="grow-4 up-2 left-4" />
      <FontAwesomeIcon
        icon={faUserFriends}
        transform="right-8 down-7 shrink-5 flip-h"
      />
    </span>
  );
}

function PlayerViewButton(props: {
  cardState: CardState;
  popToast: (message: string) => void;
}) {
  const { state, dispatch } = useContext(ReducerContext);

  if (props.cardState.playerViewPermission === PlayerViewPermission.Visible) {
    return (
      <Button
        icon={<PlayerViewIcon topLayer={faEye} />}
        tip="Players can see this card."
        hoverIndicator
        onClick={() => {
          const permission = state.user.hasEpic
            ? PlayerViewPermission.Interact
            : PlayerViewPermission.Hidden;
          dispatch(
            CardActions.SetPlayerViewPermission({
              cardId: props.cardState.cardId,
              playerViewPermission: permission,
            })
          );
          if (permission === PlayerViewPermission.Interact) {
            props.popToast("Interactable in Player View");
          }
          if (permission === PlayerViewPermission.Hidden) {
            props.popToast("Hidden from Player View");
          }
        }}
      />
    );
  }

  if (props.cardState.playerViewPermission === PlayerViewPermission.Interact) {
    return (
      <Button
        icon={<PlayerViewIcon topLayer={faPencilAlt} />}
        tip="Players can interact with this card."
        hoverIndicator
        onClick={() => {
          dispatch(
            CardActions.SetPlayerViewPermission({
              cardId: props.cardState.cardId,
              playerViewPermission: PlayerViewPermission.Hidden,
            })
          );
          props.popToast("Hidden from Player View");
        }}
      />
    );
  }

  return (
    <Button
      icon={<PlayerViewIcon topLayer={faEyeSlash} />}
      tip="Players cannot see this card."
      hoverIndicator
      onClick={() => {
        dispatch(
          CardActions.SetPlayerViewPermission({
            cardId: props.cardState.cardId,
            playerViewPermission: PlayerViewPermission.Visible,
          })
        );
        props.popToast("Revealed in Player View");
      }}
    />
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
