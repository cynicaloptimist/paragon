import { CardState } from "./CardState";

export function InitialCardState(cardId: string, type: string): CardState {
  const baseCard = {
    cardId,
  };

  if (type === "clock") {
    return {
      ...baseCard,
      title: "Clock",
      type,
      value: 0,
      max: 6,
    };
  }

  if (type === "roll-table") {
    return {
      ...baseCard,
      title: "Random Table",
      type,
      lastRoll: null,
      entries: [
        { weight: 1, content: "Test" },
        { weight: 1, content: "Test2" },
        { weight: 2, content: "Test3" },
        { weight: 2, content: "Test4" },
        { weight: 1, content: "Test5" },
      ],
    };
  }

  if (type === "image") {
    return {
      ...baseCard,
      title: "Image",
      type,
      imageUrl: "",
    };
  }

  return {
    ...baseCard,
    title: "Article",
    type: "article",
    content: "",
  };
}
