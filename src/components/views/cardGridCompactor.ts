import {
  collides,
  cloneLayout,
  cloneLayoutItem,
  getFirstCollision,
  verticalCompactor,
  type Compactor,
  type Layout,
  type LayoutItem,
} from "react-grid-layout";
import type { DashboardState } from "../../state/DashboardState";

type CardGridLayoutSettings = Pick<
  DashboardState,
  "layoutCompaction" | "layoutPushCards"
>;

function pushCollisionsDown(
  layout: LayoutItem[],
  item: LayoutItem,
  moveToY: number,
  hasStatics: boolean,
) {
  item.y += 1;
  const itemIndex = layout.findIndex(
    (layoutItem) => layoutItem.i === item.i,
  );

  for (let index = itemIndex + 1; index < layout.length; index++) {
    const otherItem = layout[index];
    if (!otherItem || otherItem.static) {
      continue;
    }
    if (!hasStatics && otherItem.y > item.y + item.h) {
      break;
    }
    if (collides(item, otherItem)) {
      pushCollisionsDown(
        layout,
        otherItem,
        moveToY + item.h,
        hasStatics,
      );
    }
  }

  item.y = moveToY;
}

function compactCollisionsOnly(layout: Layout): Layout {
  const workingLayout = cloneLayout(layout).sort((a, b) => {
    if (a.moved !== b.moved) {
      return a.moved ? -1 : 1;
    }
    return a.y - b.y || a.x - b.x;
  });
  const compareWith = workingLayout.filter((item) => item.static);
  const hasStatics = compareWith.length > 0;
  const compactedLayout: Array<Layout[number]> = new Array(
    workingLayout.length,
  );
  const outputIndexes = new Map(
    layout.map((item, index) => [item.i, index]),
  );

  workingLayout.forEach((layoutItem) => {
    const item = cloneLayoutItem(layoutItem);

    if (!item.static) {
      let collision = getFirstCollision(compareWith, item);
      while (collision) {
        pushCollisionsDown(
          workingLayout,
          item,
          collision.y + collision.h,
          hasStatics,
        );
        collision = getFirstCollision(compareWith, item);
      }

      item.x = Math.max(item.x, 0);
      item.y = Math.max(item.y, 0);
      compareWith.push(item);
    }

    item.moved = false;
    const outputIndex = outputIndexes.get(item.i);
    if (outputIndex !== undefined) {
      compactedLayout[outputIndex] = item;
    }
  });

  return compactedLayout;
}

const collisionOnlyCompactor: Compactor = {
  type: null,
  // Let RGL preserve the pointer-selected position. This compactor resolves
  // the transient overlap immediately, with the moved item taking priority.
  allowOverlap: true,
  compact: compactCollisionsOnly,
};

const collisionOnlyPreventCollisionCompactor: Compactor = {
  ...collisionOnlyCompactor,
  allowOverlap: false,
  preventCollision: true,
};

const verticalPreventCollisionCompactor: Compactor = {
  ...verticalCompactor,
  preventCollision: true,
};

export function getCardGridCompactor(
  settings: CardGridLayoutSettings,
): Compactor {
  const preventCollision =
    settings.layoutPushCards === "preventcollision";

  if (settings.layoutCompaction === "compact") {
    return preventCollision
      ? verticalPreventCollisionCompactor
      : verticalCompactor;
  }

  return preventCollision
    ? collisionOnlyPreventCollisionCompactor
    : collisionOnlyCompactor;
}
