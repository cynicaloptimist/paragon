import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "grommet";
import _ from "lodash";
import { useContext } from "react";
import { Actions } from "../../../actions/Actions";
import { randomString } from "../../../randomString";
import { ReducerContext } from "../../../reducers/ReducerContext";
import {
  CampaignLibraryDefaultRow,
  CampaignLibraryRow,
} from "./CampaignLibraryRow";

export function CampaignLibrary() {
  const { state, dispatch } = useContext(ReducerContext);
  const campaigns = Object.values(state.campaignsById);
  const campaignsSorted = _.sortBy(campaigns, (c) => c.title);

  return (
    <Box pad="xsmall" overflow={{ vertical: "auto" }}>
      <CampaignLibraryDefaultRow />
      {campaignsSorted.map((c) => {
        return (
          <CampaignLibraryRow
            key={c.id}
            campaignId={c.id}
            campaignTitle={c.title}
          />
        );
      })}
      <Button
        onClick={() =>
          dispatch(
            Actions.CreateCampaign({
              campaignId: randomString(),
              title: "New Campaign",
            })
          )
        }
        fill="horizontal"
        label="New Campaign"
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
    </Box>
  );
}
