import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Anchor, Box, Button } from "grommet";
import { useCallback, useContext, useState } from "react";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { LongPressButton } from "../../common/LongPressButton";
import { Actions } from "../../../actions/Actions";
import { RenameCampaign } from "./RenameCampaign";
import { Link } from "react-router-dom";

export function CampaignLibraryRow(props: {
  // Default campaign has an undefined Id.
  campaignId: string;
  campaignTitle: string;
}) {
  const { state, dispatch } = useContext(ReducerContext);
  const [isRenaming, setIsRenaming] = useState(false);
  const activeCampaignId = state.activeCampaignId;

  const isActiveCampaign = activeCampaignId === props.campaignId;

  const deleteCampaign = useCallback(() => {
    if (!props.campaignId) {
      return;
    }
    dispatch(Actions.DeleteCampaign({ campaignId: props.campaignId }));
  }, [dispatch, props.campaignId]);

  if (isRenaming && props.campaignId) {
    return (
      <RenameCampaign
        campaignId={props.campaignId}
        onComplete={() => setIsRenaming(false)}
      />
    );
  }

  return (
    <Box
      flex={false}
      direction="row"
      background={{
        color: isActiveCampaign ? "brand-2" : "transparent",
      }}
    >
      <Box
        fill="horizontal"
        justify="center"
        margin="xsmall"
        style={{ overflowX: "hidden" }}
      >
        <Link
          to={`/c/${props.campaignId}`}
          component={Anchor}
          style={{ fontWeight: "normal" }}
        >
          {props.campaignTitle}
        </Link>
      </Box>
      <Button
        tip="Rename Campaign"
        onClick={() => setIsRenaming(true)}
        icon={<FontAwesomeIcon icon={faEdit} />}
      />
      <LongPressButton
        tip="Delete Campaign"
        onLongPress={deleteCampaign}
        icon={<FontAwesomeIcon icon={faTrash} />}
      />
    </Box>
  );
}

export function CampaignLibraryDefaultRow() {
  const { state, dispatch } = useContext(ReducerContext);
  const activeCampaignId = state.activeCampaignId;

  const isActiveCampaign = activeCampaignId === undefined;

  const setCampaignActive = useCallback(() => {
    dispatch(Actions.SetCampaignActive({ campaignId: undefined }));
  }, [dispatch]);

  return (
    <Box
      flex={false}
      direction="row"
      background={{
        color: isActiveCampaign ? "brand-2" : "transparent",
      }}
    >
      <Box
        fill="horizontal"
        justify="center"
        margin="xsmall"
        style={{ overflowX: "hidden" }}
      >
        <Button
          onClick={setCampaignActive}
          fill="horizontal"
          margin="xsmall"
          style={{ overflowX: "hidden" }}
        >
          (default campaign)
        </Button>
      </Box>
    </Box>
  );
}
