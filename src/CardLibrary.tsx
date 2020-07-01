import React, { useContext, useCallback } from "react";
import { ReducerContext } from "./ReducerContext";
import { Box, Header, Button } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import values from "lodash/values";
import { Actions } from "./Actions";
import { CardState } from "./CardState";

export function CardLibrary() {
  const { state, dispatch } = useContext(ReducerContext);

  const hideCardLibrary = useCallback(
    () => dispatch(Actions.SetCardLibraryVisibility({ visibility: false })),
    [dispatch]
  );

  return (
    <Box
      background="background"
      elevation="large"
      style={{ position: "fixed", width: "300px", height: "100%" }}
    >
      <Header background="brand" pad="small">
        <Button
          icon={<FontAwesomeIcon size="sm" icon={faBars} />}
          onClick={hideCardLibrary}
        />
      </Header>
      <Box pad="xsmall">
        {values(state.cardsById).map((card) => (
          <CardLibraryRow key={card.cardId}   card={card} />
        ))}
      </Box>
    </Box>
  );
}

function CardLibraryRow(props: { card: CardState }) {
  const { dispatch } = useContext(ReducerContext);

  const openCard = useCallback(
    () => dispatch(Actions.OpenCard({ cardId: props.card.cardId })),
    [dispatch, props.card.cardId]
  );

  return (
    <Button key={props.card.cardId} onClick={openCard}>
      {props.card.title}
    </Button>
  );
}
