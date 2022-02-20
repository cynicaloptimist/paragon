import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Header, Heading } from "grommet";
import { useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { ActiveDashboardOf } from "../../state/AppState";

export const PlayerViewTopBar = (props: {
  matchGMLayout: boolean;
  setMatchGMLayout: (matchGMLayout: boolean) => void;
}) => {
  const { state } = useContext(ReducerContext);
  return (
    <Header fill="horizontal" background="brand" pad="small" gap="none">
      <Box align="center" direction="column" fill>
        <Heading level={1} size="small" margin="none">
          {ActiveDashboardOf(state)?.name}
        </Heading>
        <Heading level={2} size="small" margin="none">
          Paragon Campaign Dashboard: Player View
        </Heading>
      </Box>
      <Button
        onClick={() => props.setMatchGMLayout(!props.matchGMLayout)}
        icon={
          <FontAwesomeIcon
            fixedWidth
            icon={props.matchGMLayout ? faLock : faLockOpen}
          />
        }
        tip={
          props.matchGMLayout
            ? "Matching GM layout"
            : "Unlocked from GM layout"
        }
      />
    </Header>
  );
};
