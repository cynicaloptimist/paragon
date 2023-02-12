import {
  faCheck,
  faDice,
  faCog,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import React, { useContext, useState } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { RollTableCardState } from "../../../state/CardState";
import BaseCard from "../base/BaseCard";
import { GetRollTableModel } from "./GetRollTableModel";
import { RollTable } from "./RollTable";
import { RollTableConfiguration } from "./RollTableConfiguration";
import { RollTableHistory } from "./RollTableHistory";

export function RollTableCard(props: { card: RollTableCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const [currentView, setCurrentView] = useState("table");
  const rollHistory = card.rollHistory || [];
  const lastRoll =
    rollHistory.length > 0 ? rollHistory[rollHistory.length - 1] : 0;
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
                CardActions.PushRollTableHistory({
                  cardId: card.cardId,
                  rollResult: RandomInt(rollTableModel.dieSize),
                })
              )
            }
            icon={<FontAwesomeIcon icon={faDice} />}
          />
          <Button
            tip="Edit Table"
            onClick={() =>
              setCurrentView(currentView === "edit" ? "table" : "edit")
            }
            icon={
              <FontAwesomeIcon
                icon={currentView === "edit" ? faCheck : faCog}
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
          rollHistory={rollHistory}
        />
      )}
    </BaseCard>
  );
}

export function RandomInt(max: number) {
  return Math.ceil(Math.random() * max);
}
