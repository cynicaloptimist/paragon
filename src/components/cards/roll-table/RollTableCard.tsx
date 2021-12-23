import {
  faCheck,
  faDice,
  faEdit,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import React, { useContext, useState } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { RollTableCardState } from "../../../state/CardState";
import { BaseCard } from "../BaseCard";
import { GetRollTableModel } from "./GetRollTableModel";
import { RollTable } from "./RollTable";
import { RollTableConfiguration } from "./RollTableConfiguration";
import { RollTableHistory } from "./RollTableHistory";

export function RollTableCard(props: { card: RollTableCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const [currentView, setCurrentView] = useState("table");
  const lastRoll =
    card.rollHistory.length > 0
      ? card.rollHistory[card.rollHistory.length - 1]
      : 0;
  const rollTableModel = GetRollTableModel(card, lastRoll);

  return (
    <BaseCard
      cardState={card}
      commands={
        <>
          <Button
            onClick={() =>
              setCurrentView(currentView === "history" ? "table" : "history")
            }
            icon={
              <FontAwesomeIcon
                icon={currentView === "history" ? faCheck : faHistory}
              />
            }
          />
          <Button
            onClick={() =>
              dispatch(
                CardActions.SetRollTableLastRoll({
                  cardId: card.cardId,
                  rollResult: RandomInt(rollTableModel.dieSize),
                })
              )
            }
            icon={<FontAwesomeIcon icon={faDice} />}
          />
          <Button
            aria-label="toggle-edit-mode"
            onClick={() =>
              setCurrentView(currentView === "edit" ? "table" : "edit")
            }
            icon={
              <FontAwesomeIcon
                icon={currentView === "edit" ? faCheck : faEdit}
              />
            }
          />
        </>
      }
    >
      {currentView === "edit" && (
        <RollTableConfiguration rollTableModel={rollTableModel} />
      )}
      {currentView === "table" && <RollTable rollTableModel={rollTableModel} />}
      {currentView === "history" && (
        <RollTableHistory
          rollTableModel={rollTableModel}
          rollHistory={card.rollHistory}
        />
      )}
    </BaseCard>
  );
}

export function RandomInt(max: number) {
  return Math.ceil(Math.random() * max);
}
