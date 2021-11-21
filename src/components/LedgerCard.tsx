import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, List, TextInput } from "grommet";
import _ from "lodash";
import { useContext, useEffect, useRef } from "react";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import {
  LedgerCardState,
  LedgerEntry,
  PlayerViewPermission,
} from "../state/CardState";
import { BaseCard } from "./BaseCard";
import { useThemeColor } from "./hooks/useThemeColor";
import { LongPressButton } from "./LongPressButton";
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

  const buttonColor = useThemeColor("light-6");

  useEffect(() => {
    scrollBottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [card.entries]);

  const valueTotal = _.sum(card.entries.map((e) => e.changeAmount));

  const submitLedgerEntry = () => {
    const commentInput = commentInputRef.current;
    const amountInput = amountInputRef.current;
    if (!(amountInput && commentInput)) {
      return;
    }
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
  };

  const submitOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitLedgerEntry();
    }
  };

  return (
    <BaseCard cardState={card} commands={<></>}>
      <Box
        flex
        overflow={{ vertical: "auto", horizontal: "hidden" }}
        justify="start"
      >
        <List data={card.entries} pad="xxsmall">
          {(entry: LedgerEntry, index: number) => {
            return (
              <Box direction="row" align="center" justify="between" flex>
                <Box flex fill pad="xsmall">
                  {entry.comment}
                </Box>
                <Box>{entry.changeAmount}</Box>
                <LongPressButton
                  key={index}
                  icon={<FontAwesomeIcon color={buttonColor} icon={faTimes} />}
                  onLongPress={() => {
                    dispatch(
                      CardActions.RemoveLedgerEntry({
                        cardId: card.cardId,
                        ledgerEntryIndex: index,
                      })
                    );
                  }}
                />
              </Box>
            );
          }}
        </List>
        <div ref={scrollBottom} />
      </Box>

      <Box direction="row" justify="end" pad="small">
        Total: {valueTotal}
      </Box>
      {canEdit && (
        <Box direction="row" gap="small">
          <TextInput
            type="text"
            placeholder="Comment"
            ref={commentInputRef}
            onKeyDown={submitOnEnter}
          />
          <Box style={{ width: "6em" }}>
            <TextInput
              type="number"
              ref={amountInputRef}
              onKeyDown={submitOnEnter}
            />
          </Box>
        </Box>
      )}
    </BaseCard>
  );
}
