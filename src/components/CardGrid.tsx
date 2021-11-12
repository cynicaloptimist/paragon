import _ from "lodash";
import { Box } from "grommet";
import React, { CSSProperties, useContext } from "react";

import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { Actions } from "../actions/Actions";
import { CardActions } from "../actions/CardActions";
import { ReducerContext } from "../reducers/ReducerContext";
import { CardState } from "../state/CardState";
import { ArticleCard } from "./ArticleCard";
import { ClockCard } from "./ClockCard";
import { DiceCard } from "./DiceCard";
import { DrawingCard } from "./DrawingCard";
import { ImageCard } from "./ImageCard";
import { PDFCard } from "./PDFCard";
import { RollTableCard } from "./RollTableCard";
import { ViewType, ViewTypeContext } from "./ViewTypeContext";

type Size = { height: number; width: number };

const ResponsiveGridLayout = WidthProvider(Responsive);
const MIN_GRID_UNITS_CARD_HEIGHT = 3;
const MIN_GRID_UNITS_CARD_WIDTH = 4;

export function CardGrid() {
  const { state, dispatch } = useContext(ReducerContext);
  const canMoveCards = useContext(ViewTypeContext) !== ViewType.Player;
  const [currentBreakpoint, setCurrentBreakpoint] =
    React.useState<string>("xxl");

  if (
    state.activeDashboardId == null ||
    !state.dashboardsById[state.activeDashboardId]
  ) {
    return null;
  }

  const dashboard = state.dashboardsById[state.activeDashboardId];

  const dedupedLayouts = _.mapValues(dashboard.layoutsBySize, (layout) => {
    return _.uniqBy(layout, (l) => l.i)
      .filter((l) => dashboard.openCardIds?.includes(l.i))
      .map<Layout>((l) => {
        const layout: Layout = {
          ...l,
          isDraggable: canMoveCards,
          isResizable: canMoveCards,
        };
        return layout;
      });
  });

  const cards = dashboard.openCardIds?.map((cardId) => {
    const card = state.cardsById[cardId];
    if (!card) {
      console.warn("Open card ID missing from state: " + cardId);
      dispatch(CardActions.CloseCard({ cardId }));
      return <div key={cardId}></div>;
    }

    return <GridItem key={cardId} card={card} />;
  });

  const updateLayout = (newLayout: Layout[]) => {
    if (
      canMoveCards &&
      !_.isEqual(dashboard.layoutsBySize[currentBreakpoint], newLayout)
    ) {
      dispatch(
        Actions.SetLayouts({
          gridSize: currentBreakpoint,
          layouts: newLayout,
        })
      );
    }
  };

  return (
    <Box fill>
      <ResponsiveGridLayout
        measureBeforeMount
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
        layouts={dedupedLayouts}
        onDragStop={updateLayout}
        onResizeStop={updateLayout}
        onBreakpointChange={(newBreakpoint) => {
          const currentLayouts = dedupedLayouts[currentBreakpoint];
          setCurrentBreakpoint(newBreakpoint);
          if (!dedupedLayouts[newBreakpoint]) {
            Actions.SetLayouts({
              gridSize: newBreakpoint,
              layouts: currentLayouts,
            });
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
        preventCollision={dashboard.layoutPushCards === "preventcollision"}
      >
        {cards}
      </ResponsiveGridLayout>
    </Box>
  );
}

//This component was added to access the `style` prop that RGL injects.
const GridItem = React.forwardRef(
  (
    props: {
      card: CardState;
      style?: CSSProperties;
      children?: React.ReactChild[];
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const outerSize: Size = {
      height: CSSToNumber(props.style?.height),
      width: CSSToNumber(props.style?.width),
    };

    return (
      <div ref={ref} {...props}>
        {getComponentForCard(props.card, outerSize) || null}
        {props.children?.slice(1)}
      </div>
    );
  }
);

function CSSToNumber(item: number | string | undefined) {
  if (!item) {
    return 0;
  }
  if (typeof item === "number") {
    return item;
  }
  return parseInt(item);
}

function getComponentForCard(card: CardState, outerSize: Size) {
  if (card.type === "article") {
    return <ArticleCard card={card} />;
  }
  if (card.type === "clock") {
    return <ClockCard card={card} />;
  }
  if (card.type === "roll-table-h") {
    return <RollTableCard card={card} />;
  }
  if (card.type === "image") {
    return <ImageCard card={card} />;
  }
  if (card.type === "dice") {
    return <DiceCard card={card} />;
  }
  if (card.type === "drawing") {
    return <DrawingCard card={card} />;
  }
  if (card.type === "pdf") {
    return <PDFCard card={card} outerSize={outerSize} />;
  }
}
