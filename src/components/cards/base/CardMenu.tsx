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
import { DashboardActions } from "../../../actions/DashboardActions";
import { useActiveDashboardId } from "../../hooks/useActiveDashboardId";

export function CardMenu(props: {
  card: CardState;
  renameCard: () => void;
  popToast: (toast: string) => void;
}) {
  const { state, dispatch } = React.useContext(ReducerContext);
  const [campaignChooserActive, setCampaignChooserActive] =
    React.useState(false);

  const activeDashboardId = useActiveDashboardId();

  if (campaignChooserActive) {
    return (
      <CampaignChooser
        headerText="Move Card to Campaign"
        close={() => setCampaignChooserActive(false)}
        activeCampaignId={props.card.campaignId}
        selectCampaign={(campaignId) => {
          if (!campaignId) {
            return;
          }
          dispatch(
            CardActions.SetCardCampaign({
              cardId: props.card.cardId,
              campaignId: campaignId,
            })
          );
          const campaignTitle = state.campaignsById[campaignId]?.title;
          props.popToast(`Card moved to ${campaignTitle}.`);
        }}
      />
    );
  }

  return (
    <Menu
      dropAlign={{ right: "right", top: "bottom" }}
      icon={<FontAwesomeIcon icon={faEllipsisV} />}
      items={[
        {
          label: "Pin Card",
          onClick: () =>
            activeDashboardId &&
            dispatch(
              DashboardActions.SetCardPinned({
                dashboardId: activeDashboardId,
                cardId: props.card.cardId,
                pinned: true,
              })
            ),
        },
        {
          label: "Rename Card",
          // setTimeout to prevent onBlur from immediately firing saveAndClose
          onClick: () => setTimeout(props.renameCard, 1),
        },
        {
          label: "Create a Template from this Card",
          onClick: () => {
            const templateId = randomString();
            dispatch(
              Actions.CreateTemplateFromCard({
                cardId: props.card.cardId,
                templateId: templateId,
              })
            );
            props.popToast(
              "Template created. You can find it in the New Card menu."
            );
          },
        },
        {
          label: "Change Campaign...",
          onClick: () => setCampaignChooserActive(true),
          style: { display: state.user.hasEpic ? "unset" : "none" },
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
