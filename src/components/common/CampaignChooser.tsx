import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drop } from "grommet";
import React from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { CampaignState } from "../../state/CampaignState";
import { ChooseCampaignText } from "../cards/base/CardMenu";

export function CampaignChooser(props: {
  headerText: string;
  close: () => void;
  activeCampaignId: string | undefined;
  selectCampaign: (campaignId: string | undefined) => void;
}) {
  const { state } = React.useContext(ReducerContext);
  const targetRef = React.useRef(null);

  const campaigns: Partial<CampaignState>[] = [
    {
      id: undefined,
      title: "(default campaign)",
    },
    ...Object.values(state.campaignsById),
  ];
  return (
    <>
      <Button ref={targetRef} icon={<FontAwesomeIcon icon={faEllipsisV} />} />
      <Drop
        target={targetRef}
        align={{ right: "right", top: "bottom" }}
        onClickOutside={props.close}
        pad="xsmall"
        style={{ minWidth: "280px" }}
      >
        <ChooseCampaignText headerText={props.headerText} />
        {campaigns.map((c) => (
          <Button
            key={c.id}
            style={{ border: "none" }}
            label={c.title}
            onClick={() => props.selectCampaign(c.id)}
            active={props.activeCampaignId === c.id}
          />
        ))}
      </Drop>
    </>
  );
}
