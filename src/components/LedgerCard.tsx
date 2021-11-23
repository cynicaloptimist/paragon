import {
  faCog,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  CheckBox,
  FormField,
  List,
  TextInput,
  Tip,
} from "grommet";
import _ from "lodash";
import { useContext, useRef, useState } from "react";
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
import { useScrollTo } from "./hooks/useScrollTo";
import { ViewType, ViewTypeContext } from "./ViewTypeContext";

export function LedgerCard(props: { card: LedgerCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

  const [isEditing, setEditing] = useState(false);

  const scrollBottom = useScrollTo(card.entries);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const valueTotal = _.sum(card.entries.map((e) => e.changeAmount));

  const submitLedgerEntry = () => {
    const commentInput = commentInputRef.current;
    const amountInput = amountInputRef.current;
    if (!(amountInput && commentInput)) {
      return;
    }
    const amount = parseInt(amountInput.value);
    if (!isNaN(amount)) {
      const multiplier = card.isDecreasing ? -1 : 1;
      dispatch(
        CardActions.AddLedgerEntry({
          cardId: card.cardId,
          comment: commentInput.value,
          changeAmount: amount * multiplier,
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

  if (isEditing) {
    return (
      <BaseCard
        cardState={card}
        commands={
          <>
            <Button
              active
              onClick={() => setEditing(false)}
              icon={<FontAwesomeIcon icon={faCog} />}
            />
          </>
        }
      >
        <FormField label="Units">
          <TextInput
            placeholder="e.g. money, experience points"
            value={card.units}
            onChange={(changeEvent) => {
              dispatch(
                CardActions.SetLedgerUnits({
                  cardId: card.cardId,
                  units: changeEvent.target.value,
                })
              );
            }}
          />
        </FormField>
        <Box direction="row" align="center">
          <CheckBox
            label="New entries decrease total"
            checked={card.isDecreasing}
            toggle
            onChange={(changeEvent) => {
              dispatch(
                CardActions.SetLedgerDecreasing({
                  cardId: card.cardId,
                  isDecreasing: changeEvent.target.checked,
                })
              );
            }}
          />
          <Tip content="Use this for ledgers that generally decrease, like hit points.">
            <Button icon={<FontAwesomeIcon icon={faInfoCircle} />} />
          </Tip>
        </Box>
      </BaseCard>
    );
  }

  return (
    <BaseCard
      cardState={card}
      commands={
        <>
          <Button
            onClick={() => setEditing(true)}
            icon={<FontAwesomeIcon icon={faCog} />}
          />
        </>
      }
    >
      <Box
        flex
        overflow={{ vertical: "auto", horizontal: "hidden" }}
        justify="start"
      >
        <List data={card.entries} pad="xxsmall" show={card.entries.length - 1}>
          {(entry: LedgerEntry, index: number) => {
            return (
              <LedgerEntryRow
                key={index + JSON.stringify(entry)}
                card={card}
                entry={entry}
                index={index}
              />
            );
          }}
        </List>
        <div ref={scrollBottom} />
      </Box>

      <Box direction="row" justify="end" pad="small">
        Total: {valueTotal} {card.units}
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

const animationDuration = 500;

function LedgerEntryRow(props: {
  card: LedgerCardState;
  entry: LedgerEntry;
  index: number;
}) {
  const { card, entry, index } = props;
  const { dispatch } = useContext(ReducerContext);
  const [isDeleting, setDeleting] = useState(false);
  const buttonColor = useThemeColor("light-6");

  return (
    <Box
      direction="row"
      align="center"
      justify="between"
      flex
      animation={
        isDeleting
          ? {
              type: "fadeOut",
              duration: animationDuration,
            }
          : undefined
      }
    >
      <Box flex fill pad="xsmall">
        {entry.comment}
      </Box>
      <Box>{entry.changeAmount}</Box>
      <LongPressButton
        key={index}
        icon={<FontAwesomeIcon color={buttonColor} icon={faTimes} />}
        onLongPress={() => {
          setDeleting(true);
          setTimeout(() => {
            setDeleting(false);
            dispatch(
              CardActions.RemoveLedgerEntry({
                cardId: card.cardId,
                ledgerEntryIndex: index,
              })
            );
          }, animationDuration);
        }}
      />
    </Box>
  );
}
