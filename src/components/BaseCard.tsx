import {
  faEye,
  faEyeSlash,
  faGripLines,
  faPencilAlt,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Footer, Header, Heading, TextInput } from "grommet";
import React, { useContext, useRef } from "react";
import { CardActions } from "../actions/Actions";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardState, PlayerViewPermission } from "../state/CardState";
import { PlayerViewContext } from "./PlayerViewContext";

export function BaseCard(props: {
  commands: React.ReactNode;
  cardState: CardState;
  children: React.ReactNode;
}) {
  const canEdit = useContext(PlayerViewContext) === null;
  const innerBoxRef = useRef<HTMLDivElement>(null);

  return (
    <Box fill elevation="medium">
      <CardHeader cardState={props.cardState} />
      <Box ref={innerBoxRef} flex pad="xxsmall">
        {props.children}
      </Box>
      <Footer
        background="brand"
        justify="end"
        pad={{ right: "small" }}
        overflow={{ horizontal: "auto" }}
      >
        {canEdit && props.commands}
      </Footer>
    </Box>
  );
}

function CardHeader(props: { cardState: CardState }) {
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
  const isGmView = useContext(PlayerViewContext) === null;
  const canEdit =
    isGmView ||
    props.cardState.playerViewPermission === PlayerViewPermission.Interact;

  return (
    <Header pad="xsmall" background="brand" height="3.4rem">
      <Box fill className="drag-handle" direction="row" gap="xxsmall">
        {canEdit && <Button icon={<FontAwesomeIcon icon={faGripLines} />} />}
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
            onDoubleClick={() => isGmView && setHeaderEditable(true)}
            align="center"
          >
            <Heading level={3} margin="none" truncate>
              {props.cardState.title}
            </Heading>
          </Box>
        )}
        {isGmView && <PlayerViewButton cardState={props.cardState} />}
        {isGmView && (
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

function PlayerViewButton(props: { cardState: CardState }) {
  const { dispatch } = useContext(ReducerContext);

  if (props.cardState.playerViewPermission === PlayerViewPermission.Visible) {
    return (
      <Button
        icon={<FontAwesomeIcon icon={faEye} />}
        hoverIndicator
        onClick={() =>
          dispatch(
            CardActions.SetPlayerViewPermission({
              cardId: props.cardState.cardId,
              playerViewPermission: process.env.REACT_APP_ENABLE_PLAYER_VIEW_EDITING
                ? PlayerViewPermission.Interact
                : PlayerViewPermission.Hidden,
            })
          )
        }
      />
    );
  }

  if (props.cardState.playerViewPermission === PlayerViewPermission.Interact) {
    return (
      <Button
        icon={<FontAwesomeIcon icon={faPencilAlt} />}
        hoverIndicator
        onClick={() =>
          dispatch(
            CardActions.SetPlayerViewPermission({
              cardId: props.cardState.cardId,
              playerViewPermission: PlayerViewPermission.Hidden,
            })
          )
        }
      />
    );
  }

  return (
    <Button
      icon={<FontAwesomeIcon icon={faEyeSlash} />}
      color="text-fade"
      hoverIndicator
      onClick={() =>
        dispatch(
          CardActions.SetPlayerViewPermission({
            cardId: props.cardState.cardId,
            playerViewPermission: PlayerViewPermission.Visible,
          })
        )
      }
    />
  );
}
