import {
  faBars,

  faEllipsisV,
  faExternalLinkAlt, faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, CheckBox, Header, Heading, Menu, Text } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions, CardActions } from "../actions/Actions";
import { randomString } from "../randomString";
import { ReducerContext } from "../reducers/ReducerContext";

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
    <Header background="brand" pad="small" fill="horizontal">
      <Button
        icon={<FontAwesomeIcon size="sm" icon={faBars} />}
        onClick={showCardLibrary}
      />
      <Box fill="horizontal" direction="row" justify="center">
        <Heading level={1} size="small" margin="xxsmall">
          Paragon Campaign Dashboard
        </Heading>
      </Box>
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
      <Menu
        dropAlign={{ right: "right", top: "bottom" }}
        icon={<FontAwesomeIcon icon={faEllipsisV} />}
        items={[
          state.layoutCompaction === "free"
            ? {
                label: <CheckBox label="Compact Card Layout" />,
                onClick: () => setLayoutCompaction("compact"),
              }
            : {
                label: <CheckBox label="Compact Card Layout" checked />,
                onClick: () => setLayoutCompaction("free"),
              },
          {
            label: (
              <Text>
                <FontAwesomeIcon
                  icon={faExternalLinkAlt}
                  style={{ padding: "0 5px 1px" }}
                />
                {"Player View: " + state.playerViewId}
              </Text>
            ),
            onClick: () => window.open(`/p/${state.playerViewId}`, "_blank"),
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
