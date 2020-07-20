import React, { useContext, useRef } from "react";
import { Box, Header, Button, TextInput, Heading, Footer } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripLines,
  faTimes,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardActions } from "../actions/Actions";
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
  const canEdit = useContext(PlayerViewContext) === null;

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
            onDoubleClick={() => canEdit && setHeaderEditable(true)}
            align="center"
          >
            <Heading level={3} margin="none" truncate>
              {props.cardState.title}
            </Heading>
          </Box>
        )}
        {canEdit &&
          (props.cardState.playerViewPermission ===
          PlayerViewPermission.Hidden ? (
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
          ) : (
            <Button
              icon={<FontAwesomeIcon icon={faEye} />}
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
          ))}
        {canEdit && (
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
