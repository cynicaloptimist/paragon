import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import _ from "lodash";
import { useContext } from "react";
import { DashboardActions } from "../../actions/DashboardActions";
import { randomString } from "../../randomString";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardLibraryRow } from "./DashboardLibraryRow";

export function DashboardLibrary() {
  const { state, dispatch } = useContext(ReducerContext);
  const dashboardPairs = _.toPairs(state.dashboardsById);
  const dashboardPairsSorted = _.sortBy(
    dashboardPairs,
    ([, dashboard]) => -(dashboard.lastOpenedTimeMs ?? 0)
  );

  return (
    <Box pad="xsmall" overflow={{ vertical: "auto" }}>
      {dashboardPairsSorted.map(([dashboardId, dashboard]) => {
        return (
          <DashboardLibraryRow
            key={dashboardId}
            dashboardId={dashboardId}
            dashboard={dashboard}
          />
        );
      })}
      <Button
        onClick={() =>
          dispatch(
            DashboardActions.CreateDashboard({ dashboardId: randomString() })
          )
        }
        fill="horizontal"
        label="New Dashboard"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    </Box>
  );
}
