import {
  faEllipsisV,
  faExternalLinkAlt,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CheckBox, Header, Heading, Menu, Text } from "grommet";
import React, { useCallback, useContext } from "react";
import { Actions, CardActions } from "../actions/Actions";
import { randomString } from "../randomString";
import { ReducerContext } from "../reducers/ReducerContext";
import { LibrarySidebarControls } from "./LibrarySidebarControls";

export const TopBar = () => {
  const addArticle = useDispatchAddCard("article");
  const addClock = useDispatchAddCard("clock");
  const addRollTable = useDispatchAddCard("roll-table");
  const addDice = useDispatchAddCard("dice");
  const addImage = useDispatchAddCard("image");
  const { state, dispatch } = useContext(ReducerContext);

  const setLayoutCompaction = useCallback(
    (compaction: "free" | "compact") =>
      dispatch(Actions.SetLayoutCompaction({ layoutCompaction: compaction })),
    [dispatch]
  );

  if (state.activeDashboardId == null) {
    return (
      <Header background="brand" pad="small" fill="horizontal">
        <LibrarySidebarControls />
        <Box fill="horizontal" direction="row" justify="center">
          <Heading level={1} size="small" margin="xxsmall">
            Paragon Campaign Dashboard
          </Heading>
        </Box>
      </Header>
    );
  }

  const dashboard = state.dashboardsById[state.activeDashboardId];

  return (
    <Header background="brand" pad="small" fill="horizontal">
      <LibrarySidebarControls />
      <Box fill="horizontal" direction="row" justify="center">
        <Heading level={1} size="small" margin="xxsmall">
          Paragon Campaign Dashboard - {dashboard.name}
        </Heading>
      </Box>
      <Box direction="row">
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
            dashboard.layoutCompaction === "free"
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
                  {"Player View: " + state.activeDashboardId}
                </Text>
              ),
              onClick: () =>
                window.open(`/p/${state.activeDashboardId}`, "_blank"),
            },
          ]}
        />
      </Box>
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
