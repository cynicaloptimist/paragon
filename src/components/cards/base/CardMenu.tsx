import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Text } from "grommet";
import React from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { randomString } from "../../../randomString";
import { Actions } from "../../../actions/Actions";
import { CardActions } from "../../../actions/CardActions";
import { CampaignChooser } from "../../common/CampaignChooser";
import { CardState } from "../../../state/CardState";

export function CardMenu(props: { card: CardState }) {
  const { dispatch } = React.useContext(ReducerContext);
  const [campaignChooserActive, setCampaignChooserActive] =
    React.useState(false);

  if (campaignChooserActive) {
    return (
      <CampaignChooser
        headerText="Move Card to Campaign"
        close={() => setCampaignChooserActive(false)}
        activeCampaignId={props.card.campaignId}
        selectCampaign={(campaignId) =>
          dispatch(
            CardActions.SetCardCampaign({
              cardId: props.card.cardId,
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
                cardId: props.card.cardId,
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

export function ChooseCampaignText(props: { headerText: string }) {
  return (
    <Text alignSelf="center" margin="small" style={{ fontStyle: "italic" }}>
      {props.headerText}
    </Text>
  );
}
