import { Dice } from "dice-typescript";
import { Box, Button, Text, TextInput } from "grommet";
import { useCallback, useContext, useState } from "react";
import { CardActions } from "../../../actions/CardActions";
import { ReducerContext } from "../../../reducers/ReducerContext";
import { DiceCardState, PlayerViewPermission } from "../../../state/CardState";
import { BaseCard } from "../base/BaseCard";
import { useScrollTo } from "../../hooks/useScrollTo";
import { ViewType, ViewTypeContext } from "../../ViewTypeContext";
import { DiceRollRow } from "./DiceRollRow";
import { PlayerViewUserContext } from "../../PlayerViewUserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { DiceTextInput } from "./DiceTextInput";
import { DiceCardConfiguration } from "./DiceCardConfiguration";
import _ from "lodash";
import styled from "styled-components";

const dice = new Dice();
export const defaultQuickRolls = [
  "d2",
  "d4",
  "d6",
  "d8",
  "d10",
  "d12",
  "d20",
  "d100",
];

export function DiceCard(props: { card: DiceCardState }) {
  const { dispatch } = useContext(ReducerContext);
  const { card } = props;

  const viewType = useContext(ViewTypeContext);
  const canEdit =
    viewType !== ViewType.Player ||
    card.playerViewPermission === PlayerViewPermission.Interact;

  const playerViewUser = useContext(PlayerViewUserContext);

  const rollDice = useCallback(
    (expression: string) => {
      const result = dice.roll(expression);
      dispatch(
        CardActions.RollDiceExpression({
          cardId: card.cardId,
          expression,
          result: result.renderedExpression,
          total: result.total,
          userName: playerViewUser.name || undefined,
        })
      );
    },
    [card.cardId, dispatch, playerViewUser.name]
  );

  const [configuring, setConfiguring] = useState(false);
  const quickRolls = card.quickRolls ?? defaultQuickRolls;
  const quickRollButtons = quickRolls.map((quickRoll: string) => (
    <Button
      key={"quickroll__" + quickRoll}
      margin="xxsmall"
      onClick={() => rollDice(quickRoll)}
    >
      {quickRoll}
    </Button>
  ));
  const commands = [
    ...quickRollButtons,
    <Button
      key="configure"
      icon={<FontAwesomeIcon icon={faCog} />}
      onClick={() => setConfiguring(true)}
      tip="Configure"
    />,
  ];

  const cardHistory = _.slice(
    card.history || [],
    -(card.showHistoryLength ?? 0)
  );

  const hiddenRollCount = (card.history?.length ?? 0) - cardHistory.length;

  const scrollBottom = useScrollTo(cardHistory);

  const nameInputVisible =
    viewType === ViewType.Player && canEdit && playerViewUser.name === null;

  if (configuring) {
    return (
      <DiceCardConfiguration card={card} done={() => setConfiguring(false)} />
    );
  }

  return (
    <BaseCard cardState={card} commands={commands}>
      <Box overflow={{ vertical: "auto" }} flex justify="start">
        {hiddenRollCount > 0 && (
          <HiddenInfo>{hiddenRollCount} rolls are hidden</HiddenInfo>
        )}
        {cardHistory.map((roll, index) => (
          <DiceRollRow key={index} roll={roll} rollDice={rollDice} />
        ))}
        <div ref={scrollBottom} />
      </Box>
      {nameInputVisible && (
        <TextInput
          placeholder="Enter a name to roll dice"
          onKeyDown={(keyboardEvent) => {
            if (keyboardEvent.key !== "Enter") {
              return;
            }

            const target = keyboardEvent.target as HTMLInputElement;
            if (target.value.length) {
              playerViewUser.setName(target.value);
            }
          }}
        />
      )}
      {!nameInputVisible && canEdit && (
        <DiceTextInput rollDice={rollDice} cardHistory={cardHistory} />
      )}
    </BaseCard>
  );
}

const HiddenInfo = styled(Text)`
  font-style: italic;
  color: gray;
  text-align: center;
  font-size: smaller;
`;
