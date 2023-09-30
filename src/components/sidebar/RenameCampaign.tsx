import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, TextInput } from "grommet";
import { useCallback, useContext, useRef } from "react";
import { ReducerContext } from "../../reducers/ReducerContext";
import { Actions } from "../../actions/Actions";

export function RenameCampaign(props: {
  campaignId: string;
  onComplete: () => void;
}) {
  const { state, dispatch } = useContext(ReducerContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const submit = useCallback(() => {
    const newTitle = inputRef.current?.value;
    if (newTitle) {
      dispatch(
        Actions.RenameCampaign({
          campaignId: props.campaignId,
          title: newTitle,
        })
      );
    }
    props.onComplete();
  }, [dispatch, props]);

  const campaign = state.campaignsById[props.campaignId];

  return (
    <Box flex={false} direction="row">
      <TextInput
        defaultValue={campaign.title}
        ref={inputRef}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            submit();
          }
        }}
        autoFocus
        onFocus={(event) => event.target.select()}
      />
      <Button onClick={submit} icon={<FontAwesomeIcon icon={faCheck} />} />
    </Box>
  );
}
