import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../actions/CardActions";
import { randomString } from "../randomString";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardTypeFriendlyNames } from "../state/CardTypeFriendlyNames";

export function NewCardMenu() {
  const { dispatch } = useContext(ReducerContext);

  const menuItems = Object.keys(CardTypeFriendlyNames).map((cardType) => {
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
