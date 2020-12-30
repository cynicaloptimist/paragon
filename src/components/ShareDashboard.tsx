import { database } from "firebase/app";
import "firebase/database";
import { pickBy } from "lodash";
import { ActiveDashboardOf, AppState } from "../state/AppState";
import { removeUndefinedNodesFromTree } from "./hooks/removeUndefinedNodesFromTree";

export async function ShareDashboard(state: AppState) {
  const activeDashboard = ActiveDashboardOf(state);
  if (activeDashboard === null) {
    return false;
  }
  const dbRef = database().ref(`shared/${state.activeDashboardId}`);
  const trimmedState: AppState = removeUndefinedNodesFromTree({
    ...state,
    cardsById: pickBy(state.cardsById, (card) =>
      activeDashboard.openCardIds?.includes(card.cardId)
    ),
  });
  await dbRef.set(trimmedState);
  return true;
}
