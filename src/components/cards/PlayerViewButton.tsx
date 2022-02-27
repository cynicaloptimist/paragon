import {
  faEye,
  faEyeSlash,
  faPencilAlt,
  faUserFriends,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardState, PlayerViewPermission } from "../../state/CardState";

export function PlayerViewButton(props: {
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

export function PlayerViewIcon(props: { topLayer: IconDefinition }) {
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
