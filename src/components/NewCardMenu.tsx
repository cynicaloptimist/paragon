import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "grommet";
import React, { useCallback, useContext } from "react";
import { CardActions } from "../actions/CardActions";
import { randomString } from "../randomString";
import { ReducerContext } from "../reducers/ReducerContext";

export function NewCardMenu() {
  const addArticle = useDispatchAddCard("article");
  const addClock = useDispatchAddCard("clock");
  const addRollTable = useDispatchAddCard("roll-table");
  const addDice = useDispatchAddCard("dice");
  const addImage = useDispatchAddCard("image");

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faPlus} />}
      label="New Card"
      items={[
        {
          label: "Article",
          onClick: addArticle,
        },
        {
          label: "Clock",
          onClick: addClock,
        },
        {
          label: "Rollable Table",
          onClick: addRollTable,
        },
        {
          label: "Dice",
          onClick: addDice,
        },
        {
          label: "Image",
          onClick: addImage,
        },
      ]}
    />
  );
}
function useDispatchAddCard(cardType: string) {
  const { dispatch } = useContext(ReducerContext);
  return useCallback(() => {
    const cardId = randomString();
    dispatch(CardActions.AddCard({ cardId, cardType }));
  }, [cardType, dispatch]);
}
