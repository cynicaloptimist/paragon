export function InitialLayout(
  cardId: string,
  cardType: string
): ReactGridLayout.Layout {
  if (cardType === "drawing") {
    return {
      i: cardId,
      w: 10,
      h: 12,
      x: 8,
      y: 0,
    };
  }

  return {
    i: cardId,
    w: 8,
    h: 6,
    x: 8,
    y: 0,
  };
}
