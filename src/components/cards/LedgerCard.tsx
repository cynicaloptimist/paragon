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
import { CardActions } from "../../actions/CardActions";
import { ReducerContext } from "../../reducers/ReducerContext";
import {
  LedgerCardState,
  LedgerEntry,
  PlayerViewPermission,
} from "../../state/CardState";
import BaseCard from "./base/BaseCard";
import { useThemeColor } from "../hooks/useThemeColor";
import { LongPressButton } from "../common/LongPressButton";
import { useScrollTo } from "../hooks/useScrollTo";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";

const AMOUNT_COLUMN_WIDTH = "80px";

export function LedgerCard(props: { card: LedgerCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

  const [isEditing, setEditing] = useState(false);

  // Firebase will strip empty arrays so we need to be defensive here.
  const entries = card.entries || [];
  // Workaround for grommet providing negative indexes when adding items to an empty List
  const showList = entries.length > 0;

  const scrollBottom = useScrollTo(entries);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const valueTotal = _.sum(entries.map((e) => e.changeAmount));

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
          <Button
            active
            onClick={() => setEditing(false)}
            icon={<FontAwesomeIcon icon={faCog} />}
          />
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
        canEdit && (
          <Button
            onClick={() => setEditing(true)}
            icon={<FontAwesomeIcon icon={faCog} />}
          />
        )
      }
    >
      <Box
        flex
        overflow={{ vertical: "auto", horizontal: "hidden" }}
        justify="start"
      >
        {showList && (
          <List data={entries} pad="xxsmall" show={entries.length - 1}>
            {
              ((entry: LedgerEntry, index: number) => {
                return (
                  <LedgerEntryRow
                    key={`${card.cardId}_${index}_${entry.comment}_${entry.changeAmount}`}
                    card={card}
                    entry={entry}
                    index={index}
                  />
                );
              }) as any
            }
          </List>
        )}
        <div ref={scrollBottom} />
      </Box>

      <Box
        pad="small"
        style={{
          fontWeight: "bold",
        }}
      >
        {valueTotal} {card.units}
      </Box>
      {canEdit && (
        <Box direction="row" gap="small" justify="stretch">
          <Box width={AMOUNT_COLUMN_WIDTH}>
            <TextInput
              type="number"
              textAlign="center"
              placeholder={card.isDecreasing ? "-" : "+"}
              ref={amountInputRef}
              onKeyDown={submitOnEnter}
            />
          </Box>
          <Box flex fill>
            <TextInput
              type="text"
              placeholder="Comment"
              ref={commentInputRef}
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
      <Box width={AMOUNT_COLUMN_WIDTH} align="center">
        {entry.changeAmount}
      </Box>
      <Box flex fill pad="xsmall">
        {entry.comment}
      </Box>
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
