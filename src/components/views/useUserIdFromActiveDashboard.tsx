import { getDatabase, off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { app } from "../..";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";

export function useUserIdFromActiveDashboard() {
  const dashboardId = useActiveDashboardId();
  const [playerViewUserId, setPlayerViewUserId] = useState<string | null>(null);
  useEffect(() => {
    const database = getDatabase(app);
    const idDbRef = ref(database, `ownerByDashboardId/${dashboardId}`);

    onValue(idDbRef, (id) => {
      setPlayerViewUserId(id.val());
    });

    return () => off(idDbRef);
  }, [dashboardId]);

  return playerViewUserId;
}
