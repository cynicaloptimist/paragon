import { faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { VisibleCardsOf } from "../../state/AppState";
import { CardState, RollTableCardState } from "../../state/CardState";
import { GetRollTableModel, RandomInt } from "../cards/RollTableCard";

export function RollAllTablesButton() {
  const { state, dispatch } = useContext(ReducerContext);
  const openCards = VisibleCardsOf(state);
  const isRollTableCard = (card: CardState): card is RollTableCardState =>
    card.type === "roll-table-h";
  const tableCards: RollTableCardState[] =
    openCards.filter(isRollTableCard) || [];
  if (tableCards?.length < 2) {
    return null;
  }
  return (
    <Button
      icon={<FontAwesomeIcon icon={faDice} title="Roll on all Tables" />}
      onClick={() => {
        for (const tableCard of tableCards) {
          const rollTableModel = GetRollTableModel(tableCard, 0);
          dispatch(
            CardActions.SetRollTableLastRoll({
              cardId: tableCard.cardId,
              rollResult: RandomInt(rollTableModel.dieSize),
            })
          );
        }
      }}
    />
  );
}
