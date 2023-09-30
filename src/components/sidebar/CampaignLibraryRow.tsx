import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import { useCallback, useContext, useState } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { LongPressButton } from "../common/LongPressButton";
import { Actions } from "../../actions/Actions";
import { RenameCampaign } from "./RenameCampaign";

export function CampaignLibraryRow(props: {
  // Default campaign has an undefined Id.
  campaignId: string | undefined;
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

  const setCampaignActive = useCallback(() => {
    dispatch(Actions.SetCampaignActive({ campaignId: props.campaignId }));
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
        <Button
          onClick={setCampaignActive}
          fill="horizontal"
          margin="xsmall"
          style={{ overflowX: "hidden" }}
        >
          {props.campaignTitle}
        </Button>
      </Box>
      {props.campaignId && (
        <>
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
        </>
      )}
    </Box>
  );
}
