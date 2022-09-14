import { FrameCardState } from "../../state/CardState";
import { BaseCard } from "./base/BaseCard";

export function FrameCard(props: { card: FrameCardState }) {
  return (
    <BaseCard cardState={props.card} commands={[]}>
      <iframe title={props.card.title} src={props.card.frameUrl} />
    </BaseCard>
  );
}
