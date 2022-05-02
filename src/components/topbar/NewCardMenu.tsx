import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../../actions/CardActions";
import { randomString } from "../../randomString";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CardTypeFriendlyNames } from "../../state/CardTypeFriendlyNames";

export function NewCardMenu() {
  const { state, dispatch } = useContext(ReducerContext);

  const availableCardTypes = Object.keys(CardTypeFriendlyNames).filter(
    (cardType) => {
      if (cardType === "info") {
        return false;
      }

      if (cardType === "pdf") {
        return state.user.hasStorage;
      }

      if (cardType === "drawing") {
        /*
         * TODO before enabling:
         * Ensure Files support is built
         */
        return process.env.REACT_APP_ENABLE_EXPERIMENTAL === "true";
      }

      return true;
    }
  );

  const menuItems = availableCardTypes.map((cardType) => {
    return {
      label: CardTypeFriendlyNames[cardType],
      onClick: () => {
        const cardId = randomString();
        dispatch(CardActions.AddCard({ cardId, cardType }));
      },
    };
  });

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faPlus} />}
      label="New Card"
      items={menuItems}
    />
  );
}
