import React, { useContext, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPlus,
  faArrowUp,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Header, Button, Heading, Menu, Box } from "grommet";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardActions, Actions } from "../actions/Actions";
import { randomString } from "../randomString";

export const TopBar = () => {
  const addArticle = useDispatchAddCard("article");
  const addClock = useDispatchAddCard("clock");
  const addRollTable = useDispatchAddCard("roll-table");
  const addDice = useDispatchAddCard("dice");
  const addImage = useDispatchAddCard("image");
  const { state, dispatch } = useContext(ReducerContext);

  const showCardLibrary = useCallback(
    () => dispatch(Actions.SetCardLibraryVisibility({ visibility: true })),
    [dispatch]
  );

  const setLayoutCompaction = useCallback(
    (compaction: "free" | "compact") =>
      dispatch(Actions.SetLayoutCompaction({ layoutCompaction: compaction })),
    [dispatch]
  );

  return (
    <Header background="brand" pad="small">
      <Button
        icon={<FontAwesomeIcon size="sm" icon={faBars} />}
        onClick={showCardLibrary}
      />
      <Box fill="horizontal" direction="row" justify="center">
        <Heading level={1} size="small" margin="xxsmall">
          Paragon Campaign Dashboard
        </Heading>
      </Box>
      {state.layoutCompaction === "free" && (
        <Button
          icon={<FontAwesomeIcon size="sm" icon={faArrowsAlt} />}
          onClick={() => setLayoutCompaction("compact")}
        />
      )}
      {state.layoutCompaction === "compact" && (
        <Button
          icon={<FontAwesomeIcon size="sm" icon={faArrowUp} />}
          onClick={() => setLayoutCompaction("free")}
        />
      )}
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
            label: "Dice",
            onClick: addDice,
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
    const cardId = randomString();
    dispatch(CardActions.AddCard({ cardId, cardType }));
  }, [cardType, dispatch]);
}
