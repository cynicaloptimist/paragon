import _ from "lodash";
import { Box, Text } from "grommet";
import React, { CSSProperties, Suspense, useContext } from "react";

import {
  getCompactor,
  Responsive,
  useContainerWidth,
  type Layout,
  type LayoutItem,
  type ResponsiveLayouts,
} from "react-grid-layout";
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

const MIN_GRID_UNITS_CARD_HEIGHT = 3;
const MIN_GRID_UNITS_CARD_WIDTH = 4;
const gridCols = { xxl: 48, xl: 36, lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 };

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
    const breakpointSize = breakpoints[breakpoint];
    if (breakpointSize !== undefined && size >= breakpointSize) {
      return breakpoint;
    }
  }
  return "xxs";
}

function layoutBottom(layout: Layout) {
  return layout.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0);
}

export function CardGrid(props: {
  matchGMLayout?: boolean;
  setMatchGMLayout?: (matchGMLayout: boolean) => void;
}) {
  const { state, dispatch } = useContext(ReducerContext);
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });
  const setContainerRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        element;
    },
    [containerRef],
  );
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
          activeDashboardId,
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
    "dashboardState",
  );

  React.useEffect(() => {
    if (
      activeDashboardId &&
      activeDashboardState &&
      matchGMLayout &&
      isPlayerView
    ) {
      const setLayoutsActions = Object.keys(
        activeDashboardState.layoutsBySize,
      ).map((size) => {
        return DashboardActions.SetLayouts({
          dashboardId: activeDashboardId,
          gridSize: size,
          layouts: activeDashboardState.layoutsBySize[size] ?? [],
        });
      });

      setLayoutsActions.forEach(localDashboardDispatch);
    }
  }, [
    matchGMLayout,
    activeDashboardId,
    activeDashboardState,
    localDashboardDispatch,
    isPlayerView,
  ]);

  const dashboard = matchGMLayout ? activeDashboardState : localDashboardState;

  const cards = GetVisibleCards(state, activeDashboardId);

  // useMemo is used to take advantage of https://github.com/react-grid-layout/react-grid-layout#performance
  const gridItems = React.useMemo(
    () =>
      cards.map((card) => {
        return <GridItem key={card.cardId} card={card} />;
      }),
    [cards],
  );

  React.useEffect(() => {
    if (dashboard && mounted) {
      setCurrentBreakpoint(breakpointForSize(width));
    }
  }, [dashboard, mounted, width]);

  if (!dashboard) {
    return <Box fill ref={setContainerRef} />;
  }

  const visibleCardIds = cards.map((card) => card.cardId);
  const dedupedLayouts: ResponsiveLayouts = _.mapValues(
    dashboard.layoutsBySize,
    (layout) => {
      const existingLayouts = _.uniqBy(layout ?? [], (l) => l.i)
        .filter((l) => visibleCardIds.includes(l.i))
        .map<LayoutItem>((l) => {
          const sanitizedLayout: LayoutItem = {
            ...l,
            w: _.max([l.w, MIN_GRID_UNITS_CARD_WIDTH])!,
            h: _.max([l.h, MIN_GRID_UNITS_CARD_HEIGHT])!,
            minW: MIN_GRID_UNITS_CARD_WIDTH,
            minH: MIN_GRID_UNITS_CARD_HEIGHT,
          };
          return sanitizedLayout;
        });

      const existingLayoutIds = existingLayouts.map((layout) => layout.i);
      const missingLayouts = visibleCardIds
        .filter((cardId) => !existingLayoutIds.includes(cardId))
        .reduce<LayoutItem[]>((layouts, cardId) => {
          layouts.push({
            i: cardId,
            x: 0,
            y: layoutBottom([...existingLayouts, ...layouts]),
            w: MIN_GRID_UNITS_CARD_WIDTH,
            h: MIN_GRID_UNITS_CARD_HEIGHT,
            minW: MIN_GRID_UNITS_CARD_WIDTH,
            minH: MIN_GRID_UNITS_CARD_HEIGHT,
          });
          return layouts;
        }, []);

      return [...existingLayouts, ...missingLayouts];
    },
  );

  const updateLayout = (newLayout: Layout) => {
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

  const compactor = getCompactor(
    dashboard.layoutCompaction === "compact" ? "vertical" : null,
    false,
    dashboard.layoutPushCards === "preventcollision",
  );

  return (
    <Box fill ref={setContainerRef}>
      {mounted && (
        <Responsive
          width={width}
          breakpoints={breakpoints}
          cols={gridCols}
          rowHeight={30}
          dragConfig={{ enabled: true, handle: ".drag-handle" }}
          resizeConfig={{ enabled: true, handles: ["se"] }}
          compactor={compactor}
          style={{ flexGrow: 1 }}
          layouts={dedupedLayouts}
          onDragStop={updateLayout}
          onResizeStop={updateLayout}
          onBreakpointChange={(newBreakpoint) => {
            const currentLayouts = dedupedLayouts[currentBreakpoint] ?? [];
            setCurrentBreakpoint(newBreakpoint);
            if (activeDashboardId && !dedupedLayouts[newBreakpoint]) {
              DashboardActions.SetLayouts({
                dashboardId: activeDashboardId,
                gridSize: newBreakpoint,
                layouts: currentLayouts,
              });
            }
          }}
          margin={state.appSettings.collapseMargins ? [0, 0] : undefined}
        >
          {gridItems}
        </Responsive>
      )}
    </Box>
  );
}

//This component was added to access the `style` prop that RGL injects.
const GridItem = React.forwardRef(
  (
    props: {
      card: CardState;
      style?: CSSProperties;
      children?: React.ReactNode;
    },
    ref: React.Ref<HTMLDivElement>,
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
            {props.children}
          </ErrorBoundary>
        </Suspense>
      </div>
    );
  },
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
