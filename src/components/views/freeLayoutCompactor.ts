import {
  collides,
  cloneLayout,
  cloneLayoutItem,
  getFirstCollision,
  type Compactor,
  type Layout,
  type LayoutItem,
} from "react-grid-layout";

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

function compactFreeLayout(layout: Layout): Layout {
  const workingLayout = cloneLayout(layout);
  const compareWith = workingLayout.filter((item) => item.static);
  const hasStatics = compareWith.length > 0;
  const compactedLayout: Array<Layout[number]> = new Array(
    workingLayout.length,
  );

  workingLayout.forEach((layoutItem, index) => {
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
    compactedLayout[index] = item;
  });

  return compactedLayout;
}

const freeLayoutCompactor: Compactor = {
  type: null,
  allowOverlap: false,
  compact: compactFreeLayout,
};

const freeLayoutPreventCollisionCompactor: Compactor = {
  ...freeLayoutCompactor,
  preventCollision: true,
};

export function getFreeLayoutCompactor(preventCollision: boolean): Compactor {
  return preventCollision
    ? freeLayoutPreventCollisionCompactor
    : freeLayoutCompactor;
}
