import { Box, List, Paragraph, Text, TextInput } from "grommet";
import _ from "lodash";
import { useContext, useEffect, useRef } from "react";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { LedgerCardState, PlayerViewPermission } from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { ViewType, ViewTypeContext } from "./ViewTypeContext";

export function LedgerCard(props: { card: LedgerCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

  const scrollBottom = useRef<HTMLDivElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [card.entries]);

  const valueTotal = _.sum(card.entries.map((e) => e.changeAmount));

  const submitOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const commentInput = commentInputRef.current;
    const amountInput = amountInputRef.current;
    if (!(amountInput && commentInput)) {
      return;
    }
    if (event.key === "Enter") {
      const amount = parseInt(amountInput.value);
      if (!isNaN(amount)) {
        dispatch(
          CardActions.AddLedgerEntry({
            cardId: card.cardId,
            comment: commentInput.value,
            changeAmount: amount,
          })
        );
        amountInput.value = "";
        commentInput.value = "";
      }
    }
  };

  return (
    <BaseCard cardState={card} commands={<></>}>
      <Box overflow={{ vertical: "auto" }} flex justify="start">
        <List
          data={card.entries}
          primaryKey={(entry) => {
            return <Text>{entry.comment}</Text>;
          }}
          secondaryKey={(entry) => {
            return <Text>{entry.changeAmount}</Text>;
          }}
        />

        <div ref={scrollBottom} />
      </Box>

      <Box direction="row" justify="end" pad="small">
        Total: {valueTotal}
      </Box>
      {canEdit && (
        <Box direction="row" gap="small">
          <TextInput
            type="text"
            ref={commentInputRef}
            onKeyDown={submitOnEnter}
          />
          <TextInput
            type="number"
            ref={amountInputRef}
            onKeyDown={submitOnEnter}
          />
        </Box>
      )}
    </BaseCard>
  );
}
