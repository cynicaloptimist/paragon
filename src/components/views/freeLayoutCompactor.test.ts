import type { Layout } from "react-grid-layout";
import { getFreeLayoutCompactor } from "./freeLayoutCompactor";

test("pushes overlapping cards down without enabling auto-compaction", () => {
  const layout: Layout = [
    { i: "a", x: 0, y: 0, w: 4, h: 4 },
    { i: "b", x: 0, y: 3, w: 4, h: 3 },
    { i: "c", x: 0, y: 5, w: 4, h: 2 },
  ];

  const compacted = getFreeLayoutCompactor(false).compact(layout, 12);

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

test("preserves gaps in a free layout", () => {
  const layout: Layout = [
    { i: "a", x: 0, y: 5, w: 4, h: 3 },
    { i: "b", x: 0, y: 12, w: 4, h: 3 },
  ];

  const compacted = getFreeLayoutCompactor(false).compact(layout, 12);

  expect(compacted.map(({ i, y }) => ({ i, y }))).toEqual([
    { i: "a", y: 5 },
    { i: "b", y: 12 },
  ]);
});

test("exposes the prevent-collision setting", () => {
  expect(getFreeLayoutCompactor(false).preventCollision).toBeUndefined();
  expect(getFreeLayoutCompactor(true).preventCollision).toBe(true);
});
