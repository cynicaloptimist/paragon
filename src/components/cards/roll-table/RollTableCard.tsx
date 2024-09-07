import {
  faCheck,
  faDice,
  faCog,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import { useCallback, useContext, useState } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { RollTableCardState } from "../../../state/CardState";
import BaseCard from "../base/BaseCard";
import { GetRollTableModel } from "./GetRollTableModel";
import { RollTable } from "./RollTable";
import { RollTableConfiguration } from "./RollTableConfiguration";
import { RollTableHistory } from "./RollTableHistory";
import { GetDashboard } from "../../../state/AppState";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";

export default function RollTableCard(props: { card: RollTableCardState }) {
  const { state, dispatch } = useContext(ReducerContext);
  const { card } = props;

  const [currentView, setCurrentView] = useState("table");
  const rollHistory = card.rollHistory || [];
  const lastRoll =
    rollHistory.length > 0 ? rollHistory[rollHistory.length - 1] ?? 0 : 0;
  const rollTableModel = GetRollTableModel(card, lastRoll);

  const doTableRoll = useCallback(
    () =>
      dispatch(
        CardActions.PushRollTableHistory({
          cardId: card.cardId,
          rollResult: RandomInt(rollTableModel.dieSize),
        })
      ),
    [card.cardId, dispatch, rollTableModel.dieSize]
  );

  const activeDashboard = GetDashboard(state, useActiveDashboardId());
  const isPinned = activeDashboard?.pinnedCardIds?.includes(props.card.cardId);

  return (
    <BaseCard
      cardState={card}
      commands={
        <>
          <Button
            onClick={() =>
              setCurrentView(currentView === "history" ? "table" : "history")
            }
            tip={currentView === "history" ? "View Table" : "View Roll History"}
            icon={
              <FontAwesomeIcon
                icon={currentView === "history" ? faCheck : faHistory}
              />
            }
          />
          <Button
            onClick={doTableRoll}
            icon={<FontAwesomeIcon icon={faDice} />}
            tip="Roll"
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
      {isPinned && (
        <Button
          hoverIndicator
          style={{
            position: "absolute",
            bottom: 4,
            right: 24,
          }}
          onClick={doTableRoll}
          icon={<FontAwesomeIcon icon={faDice} />}
          tip="Roll"
        />
      )}
    </BaseCard>
  );
}

export function RandomInt(max: number) {
  return Math.ceil(Math.random() * max);
}
