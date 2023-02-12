import _ from "lodash";
import { Box, Text } from "grommet";
import React, { CSSProperties, Suspense, useContext } from "react";

import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { ReducerContext } from "../../reducers/ReducerContext";
import { DashboardReducer } from "../../reducers/DashboardReducer";
import { CardState } from "../../state/CardState";
import { ViewType, ViewTypeContext } from "../ViewTypeContext";
import { GetDashboard, GetVisibleCards } from "../../state/AppState";
import { DashboardState } from "../../state/DashboardState";
import BaseCard from "../cards/base/BaseCard";
import { useStorageBackedReducer } from "../hooks/useStorageBackedReducer";
import { UpdateMissingOrLegacyAppState } from "../../state/LegacyAppState";
import { DashboardActions } from "../../actions/DashboardActions";
import { useActiveDashboardId } from "../hooks/useActiveDashboardId";
import { ErrorBoundary } from "react-error-boundary";
import styled from "styled-components";
import { getComponentForCard, Size } from "./getComponentForCard";

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
  const activeDashboardId = useActiveDashboardId();
  const activeDashboardState = GetDashboard(state, activeDashboardId);

  const [localDashboardState, localDashboardDispatch] = useStorageBackedReducer(
    DashboardReducer,
    (storedState) => {
      const storedActiveDashboardState =
        storedState &&
        GetDashboard(
          UpdateMissingOrLegacyAppState(storedState),
          activeDashboardId
        );
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
    if (activeDashboardId && activeDashboardState && !matchGMLayout) {
      const setLayoutsActions = Object.keys(
        activeDashboardState.layoutsBySize
      ).map((size) => {
        return DashboardActions.SetLayouts({
          dashboardId: activeDashboardId,
          gridSize: size,
          layouts: activeDashboardState.layoutsBySize[size],
        });
      });

      setLayoutsActions.forEach(localDashboardDispatch);
    }
  }, [
    matchGMLayout,
    activeDashboardId,
    activeDashboardState,
    localDashboardDispatch,
  ]);

  const dashboard = matchGMLayout ? activeDashboardState : localDashboardState;

  const cards = GetVisibleCards(state, activeDashboardId);

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
    if (
      activeDashboardId &&
      !_.isEqual(dashboard.layoutsBySize[currentBreakpoint], newLayout)
    ) {
      const action = DashboardActions.SetLayouts({
        dashboardId: activeDashboardId,
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
          if (activeDashboardId && !dedupedLayouts[newBreakpoint]) {
            DashboardActions.SetLayouts({
              dashboardId: activeDashboardId,
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
        <Suspense
          fallback={
            <BaseCard commands={[]} cardState={card}>
              <Text>Loading...</Text>
            </BaseCard>
          }
        >
          <ErrorBoundary
            fallbackRender={(props: { error: { message: string } }) => {
              return (
                <BaseCard commands={[]} cardState={card}>
                  <Text>There was a problem loading this card:</Text>
                  <ErrorText>{props.error.message}</ErrorText>
                </BaseCard>
              );
            }}
          >
            {getComponentForCard(props.card, outerSize) || null}
            {props.children?.slice(1)}
          </ErrorBoundary>
        </Suspense>
      </div>
    );
  }
);

const ErrorText = styled.pre`
  white-space: pre-wrap;
`;

function CSSToNumber(item: number | string | undefined) {
  if (!item) {
    return 0;
  }
  if (typeof item === "number") {
    return item;
  }
  return parseInt(item);
}
