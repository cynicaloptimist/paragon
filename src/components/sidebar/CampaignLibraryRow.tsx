import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import { useCallback, useContext } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { LongPressButton } from "../common/LongPressButton";
import { Actions } from "../../actions/Actions";

export function CampaignLibraryRow(props: {
  // Default campaign has an undefined Id.
  campaignId: string | undefined;
  campaignTitle: string;
}) {
  const { state, dispatch } = useContext(ReducerContext);
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
        <LongPressButton
          tip="Delete Campaign"
          onLongPress={deleteCampaign}
          icon={<FontAwesomeIcon icon={faTrash} />}
        />
      )}
    </Box>
  );
}
