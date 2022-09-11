import {
  faLock,
  faLockOpen,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Drop, Header, Heading, TextInput } from "grommet";
import { useContext, useRef, useState } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { GetDashboard } from "../../state/AppState";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { PlayerViewUserContext } from "../PlayerViewUserContext";

export const PlayerViewTopBar = (props: {
  matchGMLayout: boolean;
  setMatchGMLayout: (matchGMLayout: boolean) => void;
}) => {
  const { state } = useContext(ReducerContext);
  const dashboardId = useActiveDashboardId();
  return (
    <Header
      fill="horizontal"
      background="brand"
      pad="small"
      gap="none"
      height="xsmall"
    >
      <Box align="center" direction="column" fill>
        <Heading level={1} size="small" margin="none">
          {GetDashboard(state, dashboardId)?.name}
        </Heading>
        <Heading level={2} size="small" margin="none">
          Paragon Campaign Dashboard: Player View
        </Heading>
      </Box>
      <SetPlayerNameButton />
      <Button
        onClick={() => props.setMatchGMLayout(!props.matchGMLayout)}
        icon={
          <FontAwesomeIcon
            fixedWidth
            icon={props.matchGMLayout ? faLock : faLockOpen}
          />
        }
        tip={
          props.matchGMLayout ? "Matching GM layout" : "Unlocked from GM layout"
        }
      />
    </Header>
  );
};

function SetPlayerNameButton() {
  const [inputVisible, setInputVisible] = useState(false);
  const buttonRef = useRef(null);
  const playerViewUser = useContext(PlayerViewUserContext);

  return (
    <>
      <Button
        onClick={() => setInputVisible(!inputVisible)}
        icon={<FontAwesomeIcon fixedWidth icon={faUserPen} />}
        tip="Set Player Name"
        ref={buttonRef}
      />
      {buttonRef.current && inputVisible && (
        <Drop
          target={buttonRef.current}
          align={{ top: "bottom" }}
          onClickOutside={() => setInputVisible(false)}
        >
          <TextInput
            placeholder="Player Name"
            defaultValue={playerViewUser.name ?? undefined}
            onKeyDown={(keyboardEvent) => {
              if (keyboardEvent.key !== "Enter") {
                return;
              }
              const target = keyboardEvent.target as HTMLInputElement;
              if (target.value.length > 0) {
                playerViewUser.setName(target.value);
                setInputVisible(false);
              }
            }}
          />
        </Drop>
      )}
    </>
  );
}
