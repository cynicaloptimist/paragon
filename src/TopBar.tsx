import React, { useContext, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Header, Button, Heading, Menu } from "grommet";
import { ReducerContext } from "./ReducerContext";
import { Actions } from "./Actions";

export const TopBar = () => {
  const addArticle = useDispatchAddCard("article");
  const addClock = useDispatchAddCard("clock");
  const addRollTable = useDispatchAddCard("roll-table");
  const addImage = useDispatchAddCard("image");
  const { dispatch } = useContext(ReducerContext);
  const showCardLibrary = useCallback(
    () => dispatch(Actions.SetCardLibraryVisibility({ visibility: true })),
    [dispatch]
  );

  return (
    <Header background="brand" pad="small">
      <Button
        icon={<FontAwesomeIcon size="sm" icon={faBars} />}
        onClick={showCardLibrary}
      />
      <Heading level={1} size="small" margin="xxsmall">
        Paragon Campaign Dashboard
      </Heading>
      <Menu
        dropAlign={{ right: "right", top: "bottom" }}
        icon={<FontAwesomeIcon icon={faPlus} />}
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
            label: "Image",
            onClick: addImage,
          },
        ]}
      />
    </Header>
  );
};

function useDispatchAddCard(cardType: string) {
  const { dispatch } = useContext(ReducerContext);
  return useCallback(() => {
    const cardId = newId();
    dispatch(Actions.AddCard({ cardId, cardType }));
  }, [cardType, dispatch]);
}

const idChars = "qwertyuiopasdfghjklzxcvbnm1234567890";
function newId(length: number = 8): string {
  let id = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * idChars.length);
    id += idChars[randomIndex];
  }
  return id;
}
