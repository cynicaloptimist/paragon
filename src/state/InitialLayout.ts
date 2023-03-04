export function InitialLayout(
  cardId: string,
  cardType: string,
  dashboardSize: string
): ReactGridLayout.Layout {
  let xOffset = 8;
  if (["xxs", "xs", "sm"].includes(dashboardSize)) {
    xOffset = 0;
  }

  if (cardType === "drawing") {
    return {
      i: cardId,
      w: 10,
      h: 12,
      x: xOffset,
      y: 0,
    };
  }

  return {
    i: cardId,
    w: 8,
    h: 6,
    x: xOffset,
    y: 0,
  };
}
