import React, { useContext } from "react";
import GridLayout from "react-grid-layout";
import { Actions } from "./Actions";
import { ArticleCard } from "./ArticleCard";
import { ReducerContext } from "./ReducerContext";
import { CardState } from "./CardState";
import { ClockCard } from "./ClockCard";
import { RollTableCard } from "./RollTableCard";

export function CardGrid() {
  const { state, dispatch } = useContext(ReducerContext);

  const cards = state.openCardIds.map((cardId, index) => {
    const thisLayout = state.layouts.find((l) => l.i === cardId);
    return (
      <div
        key={cardId}
        data-grid={thisLayout ?? { x: 2 * (index % 6), y: 0, w: 2, h: 4 }}
      >
        {getComponentForCard(state.cardsById[cardId])}
      </div>
    );
  });

  return (
    <GridLayout
      cols={12}
      rowHeight={30}
      width={1200}
      draggableHandle=".drag-handle"
      compactType={null}
      style={{ flexGrow: 1 }}
      onLayoutChange={(newLayout) => dispatch(Actions.SetLayouts(newLayout))}
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
}
