import styled from "styled-components";
import { FrameCardState } from "../../state/CardState";
import { BaseCard } from "./base/BaseCard";

export function FrameCard(props: { card: FrameCardState }) {
  return (
    <BaseCard cardState={props.card} commands={[]}>
      <Frame title={props.card.title} src={props.card.frameUrl} />
    </BaseCard>
  );
}

const Frame = styled.iframe`
  flex-grow: 1;
`;
