import { faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import React, { useContext } from "react";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { GetVisibleCards } from "../../state/AppState";
import { CardState, RollTableCardState } from "../../state/CardState";
import { RandomInt } from "../cards/roll-table/RollTableCard";
import { GetRollTableModel } from "../cards/roll-table/GetRollTableModel";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";

export function RollAllTablesButton() {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  const openCards = GetVisibleCards(state, dashboardId);
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
            CardActions.PushRollTableHistory({
              cardId: tableCard.cardId,
              rollResult: RandomInt(rollTableModel.dieSize),
            })
          );
        }
      }}
    />
  );
}
