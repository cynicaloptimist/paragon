import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Text, Tip } from "grommet";
import React, { useContext } from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";

export function CampaignHeader() {
  const { state } = useContext(ReducerContext);
  if (state.activeCampaignId) {
    const activeCampaign = state.campaignsById[state.activeCampaignId];
    if (activeCampaign) {
      return (
        <Text>
          <Tip content="Cards shown for Active Campaign">
            <Button icon={<FontAwesomeIcon icon={faGlobe} />} />
          </Tip>
          {activeCampaign.title}
        </Text>
      );
    }
  }
  return null;
}
