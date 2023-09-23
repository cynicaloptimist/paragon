import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Drop, Menu, Text } from "grommet";
import React from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { randomString } from "../../../randomString";
import { Actions } from "../../../actions/Actions";
import { CampaignState } from "../../../state/CampaignState";

export function CardMenu(props: { cardId: string }) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const cardState = state.cardsById[props.cardId];
  const [campaignChooserActive, setCampaignChooserActive] =
    React.useState(false);
  const targetRef = React.useRef(null);

  if (campaignChooserActive) {
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
          onClickOutside={() => setCampaignChooserActive(false)}
        >
          <ChooseCampaignText />
          {campaigns.map((c) => (
            <Button
              style={{ border: "none" }}
              label={c.title}
              onClick={() => c.id}
              active={cardState.campaignId === c.id}
            />
          ))}
        </Drop>
      </>
    );
  }

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faEllipsisV} />}
      items={[
        {
          label: "Create a Template from this Card",
          onClick: () => {
            const templateId = randomString();
            return dispatch(
              Actions.CreateTemplateFromCard({
                cardId: props.cardId,
                templateId: templateId,
              })
            );
          },
        },
        {
          label: "Change Campaign",
          onClick: () => setCampaignChooserActive(true),
        },
      ]}
    />
  );
}

function ChooseCampaignText() {
  return (
    <Text alignSelf="center" margin="small" style={{ fontStyle: "italic" }}>
      Choose Campaign
    </Text>
  );
}
