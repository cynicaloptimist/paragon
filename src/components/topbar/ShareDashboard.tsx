import { getDatabase, ref, set } from "firebase/database";
import "firebase/database";
import { pickBy } from "lodash";
import { GetDashboard, AppState } from "../../state/AppState";
import { FirebaseUtils } from "../../FirebaseUtils";
import { app } from "../..";

export async function ShareDashboard(state: AppState, dashboardId: string) {
  const activeDashboard = GetDashboard(state, dashboardId);
  if (activeDashboard === undefined) {
    return false;
  }

  const database = getDatabase(app);
  const dbRef = ref(database, `shared/${dashboardId}`);
  const trimmedState: AppState = FirebaseUtils.removeUndefinedNodesFromTree({
    ...state,
    cardsById: pickBy(state.cardsById, (card) =>
      activeDashboard.openCardIds?.includes(card.cardId)
    ),
  });
  await set(dbRef, trimmedState);
  return true;
}
