import _ from "lodash";
import { Box } from "grommet";
import React, { CSSProperties, useContext } from "react";

import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardReducer } from "../../reducers/DashboardReducer";
import { CardState } from "../../state/CardState";
import { ArticleCard } from "../cards/article/ArticleCard";
import { ClockCard } from "../cards/clock/ClockCard";
import { DiceCard } from "../cards/dice/DiceCard";
import { DrawingCard } from "../cards/DrawingCard";
import { ImageCard } from "../cards/ImageCard";
import { PDFCard } from "../cards/PDFCard";
import { RollTableCard } from "../cards/roll-table/RollTableCard";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";
import {
  ActiveDashboardOf,
  DashboardState,
  VisibleCardsOf,
} from "../../state/AppState";
import { LedgerCard } from "../cards/LedgerCard";
import { BaseCard } from "../cards/base/BaseCard";
import { useStorageBackedReducer } from "../hooks/useStorageBackedReducer";
import { UpdateMissingOrLegacyAppState } from "../../state/LegacyAppState";
import { InfoCard } from "../cards/article/InfoCard";
import { DashboardActions } from "../../actions/DashboardActions";

type Size = { height: number; width: number };

const ResponsiveGridLayout = WidthProvider(Responsive);
const MIN_GRID_UNITS_CARD_HEIGHT = 3;
const MIN_GRID_UNITS_CARD_WIDTH = 4;

const breakpoints: { [breakpoint: string]: number } = {
  xxl: 2400,
  xl: 1800,
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

function breakpointForSize(size: number) {
  for (const breakpoint in breakpoints) {
    if (size >= breakpoints[breakpoint]) {
      return breakpoint;
    }
  }
  return "xxs";
}

export function CardGrid(props: {
  matchGMLayout?: boolean;
  setMatchGMLayout?: (matchGMLayout: boolean) => void;
}) {
  const { state, dispatch } = useContext(ReducerContext);
  const matchGMLayout = props.matchGMLayout ?? true;
  const [currentBreakpoint, setCurrentBreakpoint] =
    React.useState<string>("xxl");

  const isPlayerView = useContext(ViewTypeContext) === ViewType.Player;
  const activeDashboardState = ActiveDashboardOf(state);

  const [localDashboardState, localDashboardDispatch] = useStorageBackedReducer(
    DashboardReducer,
    (storedState) => {
      const storedActiveDashboardState =
        storedState &&
        ActiveDashboardOf(UpdateMissingOrLegacyAppState(storedState));
      const emptyDashboardState: DashboardState = {
        name: "Dashboard 1",
        openCardIds: [],
        layoutsBySize: { xxl: [] },
        layoutCompaction: "free",
        layoutPushCards: "none",
      };

      return (
        storedActiveDashboardState ||
        activeDashboardState ||
        emptyDashboardState
      );
    },
    "dashboardState"
  );

  React.useEffect(() => {
    if (activeDashboardState && !matchGMLayout) {
      const setLayoutsActions = Object.keys(
        activeDashboardState.layoutsBySize
      ).map((size) => {
        return DashboardActions.SetLayouts({
          gridSize: size,
          layouts: activeDashboardState.layoutsBySize[size],
        });
      });

      setLayoutsActions.forEach(localDashboardDispatch);
    }
  }, [matchGMLayout, activeDashboardState, localDashboardDispatch]);

  const dashboard = matchGMLayout ? activeDashboardState : localDashboardState;

  const cards = VisibleCardsOf(state);

  // useMemo is used to take advantage of https://github.com/react-grid-layout/react-grid-layout#performance
  const gridItems = React.useMemo(
    () =>
      cards.map((card) => {
        return (
          <GridItem
            data-grid={{
              x: 0,
              y: 0,
              w: MIN_GRID_UNITS_CARD_WIDTH,
              h: MIN_GRID_UNITS_CARD_HEIGHT,
            }}
            key={card.cardId}
            card={card}
          />
        );
      }),
    [cards]
  );

  if (!dashboard) {
    return null;
  }

  const dedupedLayouts = _.mapValues(dashboard.layoutsBySize, (layout) => {
    return _.uniqBy(layout, (l) => l.i)
      .filter((l) => activeDashboardState?.openCardIds?.includes(l.i))
      .map<Layout>((l) => {
        const layout: Layout = {
          ...l,
          w: _.max([l.w, MIN_GRID_UNITS_CARD_WIDTH])!,
          h: _.max([l.h, MIN_GRID_UNITS_CARD_HEIGHT])!,
        };
        return layout;
      });
  });

  const updateLayout = (newLayout: Layout[]) => {
    if (!_.isEqual(dashboard.layoutsBySize[currentBreakpoint], newLayout)) {
      const action = DashboardActions.SetLayouts({
        gridSize: currentBreakpoint,
        layouts: newLayout,
      });

      if (isPlayerView) {
        localDashboardDispatch(action);
        props.setMatchGMLayout?.(false);
      } else {
        dispatch(action);
      }
    }
  };

  return (
    <Box
      fill
      ref={(boxRef) => {
        if (boxRef) {
          const box = boxRef.getBoundingClientRect();
          const breakpoint = breakpointForSize(box.width);
          setCurrentBreakpoint(breakpoint);
        }
      }}
    >
      <ResponsiveGridLayout
        measureBeforeMount
        breakpoints={breakpoints}
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
            DashboardActions.SetLayouts({
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
        {gridItems}
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

    const { card, ...attributes } = props;

    return (
      <div ref={ref} {...attributes}>
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
  if (card.type === "info") {
    return <InfoCard card={card} />;
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
    return <DrawingCard card={card} outerSize={outerSize} />;
  }
  if (card.type === "pdf") {
    return <PDFCard card={card} outerSize={outerSize} />;
  }
  if (card.type === "ledger") {
    return <LedgerCard card={card} />;
  }

  const unsupportedCard: any = card;
  return (
    <BaseCard cardState={unsupportedCard as CardState} commands={null}>
      Unsupported card type: {unsupportedCard.type}
    </BaseCard>
  );
}
