import {
  getLayoutItem,
  moveElement,
  type Compactor,
  type Layout,
} from "react-grid-layout";
import { getCardGridCompactor } from "./cardGridCompactor";

function drag(
  layout: Layout,
  itemId: string,
  x: number,
  y: number,
  compactor: Compactor,
) {
  const item = getLayoutItem(layout, itemId);
  if (!item) {
    throw new Error(`Missing layout item ${itemId}`);
  }

  const movedLayout = moveElement(
    layout,
    item,
    x,
    y,
    true,
    compactor.preventCollision ?? false,
    compactor.type,
    12,
    compactor.allowOverlap,
  );
  return compactor.compact(movedLayout, 12);
}

test.each([
  {
    autoCompact: false,
    layoutCompaction: "free" as const,
    pushCards: true,
    layoutPushCards: "none" as const,
    type: null,
    allowOverlap: true,
    preventCollision: false,
  },
  {
    autoCompact: false,
    layoutCompaction: "free" as const,
    pushCards: false,
    layoutPushCards: "preventcollision" as const,
    type: null,
    allowOverlap: false,
    preventCollision: true,
  },
  {
    autoCompact: true,
    layoutCompaction: "compact" as const,
    pushCards: true,
    layoutPushCards: "none" as const,
    type: "vertical",
    allowOverlap: false,
    preventCollision: false,
  },
  {
    autoCompact: true,
    layoutCompaction: "compact" as const,
    pushCards: false,
    layoutPushCards: "preventcollision" as const,
    type: "vertical",
    allowOverlap: false,
    preventCollision: true,
  },
])(
  "selects the compactor for Push Cards=$pushCards and Auto Compact=$autoCompact",
  ({
    layoutCompaction,
    layoutPushCards,
    type,
    allowOverlap,
    preventCollision,
  }) => {
    const compactor = getCardGridCompactor({
      layoutCompaction,
      layoutPushCards,
    });

    expect(compactor.type).toBe(type);
    expect(compactor.allowOverlap).toBe(allowOverlap);
    expect(compactor.preventCollision ?? false).toBe(preventCollision);
  },
);

test("keeps a downward-dragged card under the pointer while pushing cards below it", () => {
  const compactor = getCardGridCompactor({
    layoutCompaction: "free",
    layoutPushCards: "none",
  });
  let layout: Layout = [
    { i: "a", x: 0, y: 0, w: 4, h: 3 },
    { i: "b", x: 0, y: 3, w: 4, h: 3 },
  ];

  layout = drag(layout, "a", 0, 1, compactor);
  expect(layout.map(({ i, y }) => ({ i, y }))).toEqual([
    { i: "a", y: 1 },
    { i: "b", y: 4 },
  ]);

  layout = drag(layout, "a", 0, 2, compactor);
  expect(layout.map(({ i, y }) => ({ i, y }))).toEqual([
    { i: "a", y: 2 },
    { i: "b", y: 5 },
  ]);
});

test("gives an upward-dragged card priority over an earlier layout item", () => {
  const compactor = getCardGridCompactor({
    layoutCompaction: "free",
    layoutPushCards: "none",
  });
  const layout: Layout = [
    { i: "a", x: 0, y: 0, w: 4, h: 3 },
    { i: "b", x: 0, y: 3, w: 4, h: 3 },
  ];

  const compacted = drag(layout, "b", 0, 1, compactor);

  expect(compacted.map(({ i, y }) => ({ i, y }))).toEqual([
    { i: "a", y: 4 },
    { i: "b", y: 1 },
  ]);
});

test("keeps a horizontally dragged card in place and pushes the collision down", () => {
  const compactor = getCardGridCompactor({
    layoutCompaction: "free",
    layoutPushCards: "none",
  });
  const layout: Layout = [
    { i: "a", x: 0, y: 0, w: 4, h: 3 },
    { i: "b", x: 4, y: 0, w: 4, h: 3 },
  ];

  const compacted = drag(layout, "a", 1, 0, compactor);

  expect(
    compacted.map(({ i, x, y }) => ({ i, x, y })),
  ).toEqual([
    { i: "a", x: 1, y: 0 },
    { i: "b", x: 4, y: 3 },
  ]);
});

test("pushes overlapping cards down without enabling auto-compaction", () => {
  const layout: Layout = [
    { i: "a", x: 0, y: 0, w: 4, h: 4 },
    { i: "b", x: 0, y: 3, w: 4, h: 3 },
    { i: "c", x: 0, y: 5, w: 4, h: 2 },
  ];
  const compactor = getCardGridCompactor({
    layoutCompaction: "free",
    layoutPushCards: "none",
  });

  const compacted = compactor.compact(layout, 12);

  expect(compacted.map(({ i, y }) => ({ i, y }))).toEqual([
    { i: "a", y: 0 },
    { i: "b", y: 4 },
    { i: "c", y: 7 },
  ]);
  expect(layout.map(({ i, y }) => ({ i, y }))).toEqual([
    { i: "a", y: 0 },
    { i: "b", y: 3 },
    { i: "c", y: 5 },
  ]);
});

test("preserves gaps when auto-compaction is off", () => {
  const layout: Layout = [
    { i: "a", x: 0, y: 5, w: 4, h: 3 },
    { i: "b", x: 0, y: 12, w: 4, h: 3 },
  ];
  const compactor = getCardGridCompactor({
    layoutCompaction: "free",
    layoutPushCards: "none",
  });

  const compacted = compactor.compact(layout, 12);

  expect(compacted.map(({ i, y }) => ({ i, y }))).toEqual([
    { i: "a", y: 5 },
    { i: "b", y: 12 },
  ]);
});

test("closes vertical gaps when auto-compaction is on", () => {
  const layout: Layout = [
    { i: "a", x: 0, y: 5, w: 4, h: 3 },
    { i: "b", x: 0, y: 12, w: 4, h: 3 },
  ];
  const compactor = getCardGridCompactor({
    layoutCompaction: "compact",
    layoutPushCards: "none",
  });

  const compacted = compactor.compact(layout, 12);

  expect(compacted.map(({ i, y }) => ({ i, y }))).toEqual([
    { i: "a", y: 0 },
    { i: "b", y: 3 },
  ]);
});
