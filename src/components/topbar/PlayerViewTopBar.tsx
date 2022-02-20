import { faChain, faChainBroken } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Header, Heading } from "grommet";
import React, { useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { ActiveDashboardOf } from "../../state/AppState";

export const PlayerViewTopBar = (props: {
  matchGMLayout: boolean;
  setMatchGMLayout: (matchGMLayout: boolean) => void;
}) => {
  const { state } = useContext(ReducerContext);
  return (
    <Header
      fill="horizontal"
      background="brand"
      pad="small"
      gap="none"
      justify="center"
      direction="column"
    >
      <Heading level={1} size="small" margin="none">
        {ActiveDashboardOf(state)?.name}
      </Heading>
      <Heading level={2} size="small" margin="none">
        Paragon Campaign Dashboard: Player View
      </Heading>
      <Button
        onClick={() => props.setMatchGMLayout(!props.matchGMLayout)}
        icon={
          <FontAwesomeIcon
            icon={props.matchGMLayout ? faChain : faChainBroken}
          />
        }
      />
    </Header>
  );
};
