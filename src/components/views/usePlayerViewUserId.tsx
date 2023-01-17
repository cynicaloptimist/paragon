import { getDatabase, off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { app } from "../..";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";

export function usePlayerViewUserId() {
  const dashboardId = useActiveDashboardId();
  const [playerViewUserId, setPlayerViewUserId] = useState<string | null>(null);
  useEffect(() => {
    const database = getDatabase(app);
    const idDbRef = ref(database, `playerViews/${dashboardId}`);

    onValue(idDbRef, (id) => {
      setPlayerViewUserId(id.val());
    });

    return () => off(idDbRef);
  }, [dashboardId]);

  return playerViewUserId;
}
