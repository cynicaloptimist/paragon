import React, { useContext } from "react";
import GridLayout from "react-grid-layout";
import { Actions } from "../actions/Actions";
import { ArticleCard } from "./ArticleCard";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardState } from "../state/CardState";
import { ClockCard } from "./ClockCard";
import { RollTableCard } from "./RollTableCard";
import { ImageCard } from "./ImageCard";
import { DiceCard } from "./DiceCard";
import { PlayerViewContext } from "./PlayerViewContext";

export function CardGrid() {
  const { state, dispatch } = useContext(ReducerContext);
  const canEdit = useContext(PlayerViewContext) === null;

  const cards = state.openCardIds.map((cardId) => (
    <div key={cardId}>{getComponentForCard(state.cardsById[cardId])}</div>
  ));

  return (
    <GridLayout
      cols={24}
      rowHeight={30}
      width={1200}
      draggableHandle=".drag-handle"
      style={{ flexGrow: 1 }}
      layout={state.layouts}
      isDraggable={canEdit}
      isResizable={canEdit}
      onLayoutChange={(newLayout) => dispatch(Actions.SetLayouts(newLayout))}
      onResize={(_, __, layoutItem, placeholder) => {
        if (layoutItem.h < 3) {
          layoutItem.h = 3;
          placeholder.h = 3;
        }
        if (layoutItem.w < 4) {
          layoutItem.w = 4;
          placeholder.w = 4;
        }
      }}
      compactType={state.layoutCompaction === "compact" ? "vertical" : null}
    >
      {cards}
    </GridLayout>
  );
}

function getComponentForCard(card: CardState) {
  if (card.type === "article") {
    return <ArticleCard card={card} />;
  }
  if (card.type === "clock") {
    return <ClockCard card={card} />;
  }
  if (card.type === "roll-table") {
    return <RollTableCard card={card} />;
  }
  if (card.type === "image") {
    return <ImageCard card={card} />;
  }
  if (card.type === "dice") {
    return <DiceCard card={card} />;
  }
}
