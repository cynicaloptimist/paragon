import { Box } from "grommet";
import { isEqual, uniqBy } from "lodash";
import React, { useContext } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { Actions } from "../actions/Actions";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardState } from "../state/CardState";
import { ArticleCard } from "./ArticleCard";
import { ClockCard } from "./ClockCard";
import { DiceCard } from "./DiceCard";
import { ImageCard } from "./ImageCard";
import { RollTableCard } from "./RollTableCard";
import { ViewType, ViewTypeContext } from "./ViewTypeContext";

const ResponsiveGridLayout = WidthProvider(Responsive);
const MIN_GRID_UNITS_CARD_HEIGHT = 3;
const MIN_GRID_UNITS_CARD_WIDTH = 4;

export function CardGrid() {
  const { state, dispatch } = useContext(ReducerContext);
  const canMoveCards = useContext(ViewTypeContext) !== ViewType.Player;

  if (
    state.activeDashboardId == null ||
    !state.dashboardsById[state.activeDashboardId]
  ) {
    return null;
  }

  const dashboard = state.dashboardsById[state.activeDashboardId];

  const dedupedLayouts = uniqBy(dashboard.layouts, (l) => l.i)
    .filter((l) => dashboard.openCardIds?.includes(l.i))
    .map<Layout>((l) => {
      const layout: Layout = {
        ...l,
        isDraggable: canMoveCards,
        isResizable: canMoveCards,
      };
      return layout;
    });

  const cards = dashboard.openCardIds?.map((cardId) => {
    const card = state.cardsById[cardId];
    if (!card) {
      console.warn("Open card ID missing from state: " + cardId);
      dispatch(CardActions.CloseCard({ cardId }));
      return <div key={cardId}></div>;
    }
    return <div key={cardId}>{getComponentForCard(card)}</div>;
  });

  return (
    <Box fill>
      <ResponsiveGridLayout
        breakpoints={{
          xxl: 2400,
          xl: 1800,
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480,
          xxs: 0,
        }}
        cols={{ xxl: 48, xl: 36, lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
        rowHeight={30}
        draggableHandle=".drag-handle"
        style={{ flexGrow: 1 }}
        layouts={{ xxl: dedupedLayouts }}
        onLayoutChange={(newLayout) => {
          if (canMoveCards && !isEqual(dashboard.layouts, newLayout)) {
            dispatch(Actions.SetLayouts(newLayout));
          }
        }}
        onResize={(_, __, layoutItem, placeholder) => {
          if (layoutItem.h < MIN_GRID_UNITS_CARD_HEIGHT) {
            layoutItem.h = MIN_GRID_UNITS_CARD_HEIGHT;
            placeholder.h = MIN_GRID_UNITS_CARD_HEIGHT;
          }
          if (layoutItem.w < MIN_GRID_UNITS_CARD_WIDTH) {
            layoutItem.w = MIN_GRID_UNITS_CARD_WIDTH;
            placeholder.w = MIN_GRID_UNITS_CARD_WIDTH;
          }
        }}
        compactType={
          dashboard.layoutCompaction === "compact" ? "vertical" : null
        }
      >
        {cards}
      </ResponsiveGridLayout>
    </Box>
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
