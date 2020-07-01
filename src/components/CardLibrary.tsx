import React, { useContext, useCallback } from "react";
import { ReducerContext } from "../reducers/ReducerContext";
import { Box, Header, Button } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import values from "lodash/values";
import { Actions } from "../actions/Actions";
import { CardLibraryRow } from "./CardLibraryRow";

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
          <CardLibraryRow key={card.cardId} card={card} />
        ))}
      </Box>
    </Box>
  );
}
