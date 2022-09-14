import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "grommet";
import { useContext, useState } from "react";
import styled from "styled-components";
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import { FrameCardState } from "../../state/CardState";
import { BaseCard } from "./base/BaseCard";
import { DirectUrlInput } from "./FileUpload";

export function FrameCard(props: { card: FrameCardState }) {
  const [configActive, setConfigActive] = useState(false);
  return (
    <BaseCard
      cardState={props.card}
      commands={[
        <Button
          icon={<FontAwesomeIcon icon={faLink} />}
          onClick={() => setConfigActive(true)}
          tip="Set iframe URL"
        />,
      ]}
    >
      {configActive ? (
        <FrameCardConfig
          card={props.card}
          closeConfig={() => setConfigActive(false)}
        />
      ) : (
        <Frame title={props.card.title} src={props.card.frameUrl} />
      )}
    </BaseCard>
  );
}

export function FrameCardConfig(props: {
  card: FrameCardState;
  closeConfig: () => void;
}) {
  const { dispatch } = useContext(ReducerContext);
  return (
    <DirectUrlInput
      currentUrl={props.card.frameUrl}
      onSubmit={(newUrl) => {
        dispatch(
          CardActions.SetFrameUrl({
            cardId: props.card.cardId,
            frameUrl: newUrl,
          })
        );
        props.closeConfig();
      }}
    />
  );
}

const Frame = styled.iframe`
  flex-grow: 1;
`;
