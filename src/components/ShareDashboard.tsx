import { getDatabase, ref, set } from "firebase/database";
import "firebase/database";
import { pickBy } from "lodash";
import { ActiveDashboardOf, AppState } from "../state/AppState";
import { removeUndefinedNodesFromTree } from "./hooks/removeUndefinedNodesFromTree";
import { app } from "..";

export async function ShareDashboard(state: AppState) {
  const activeDashboard = ActiveDashboardOf(state);
  if (activeDashboard === null) {
    return false;
  }

  const database = getDatabase(app);
  const dbRef = ref(database, `shared/${state.activeDashboardId}`);
  const trimmedState: AppState = removeUndefinedNodesFromTree({
    ...state,
    cardsById: pickBy(state.cardsById, (card) =>
      activeDashboard.openCardIds?.includes(card.cardId)
    ),
  });
  await set(dbRef, trimmedState);
  return true;
}
