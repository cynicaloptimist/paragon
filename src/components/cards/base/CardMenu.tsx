import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Text } from "grommet";
import React from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { randomString } from "../../../randomString";
import { Actions } from "../../../actions/Actions";
import { CardActions } from "../../../actions/CardActions";
import { CampaignChooser } from "../../common/CampaignChooser";

export function CardMenu(props: { cardId: string }) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const cardState = state.cardsById[props.cardId];
  const [campaignChooserActive, setCampaignChooserActive] =
    React.useState(false);

  if (campaignChooserActive) {
    return (
      <CampaignChooser
        close={() => setCampaignChooserActive(false)}
        activeCampaignId={cardState.campaignId}
        selectCampaign={(campaignId) =>
          dispatch(
            CardActions.SetCardCampaign({
              cardId: cardState.cardId,
              campaignId: campaignId,
            })
          )
        }
      />
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
          label: "Change Campaign...",
          onClick: () => setCampaignChooserActive(true),
        },
      ]}
    />
  );
}

export function ChooseCampaignText() {
  return (
    <Text alignSelf="center" margin="small" style={{ fontStyle: "italic" }}>
      Choose Campaign
    </Text>
  );
}
