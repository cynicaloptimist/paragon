import { useParams } from "react-router-dom";

export function useActiveDashboardId() {
  const { dashboardId } = useParams<{ dashboardId: string | undefined }>();
  return dashboardId ?? null;
}
