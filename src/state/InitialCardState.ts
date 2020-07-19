import { CardState, PlayerViewPermission } from "./CardState";

const defaultCardTitlesByType: Record<string, string> = {
  clock: "Clock",
  "roll-table": "Random Table",
  image: "Image",
  dice: "Dice",
  article: "Article",
};

export function InitialCardState(
  cardId: string,
  type: string,
  existingCardTitles: string[]
): CardState {
  const baseCard = {
    cardId,
    playerViewPermission: PlayerViewPermission.Hidden,
    title: defaultCardTitlesByType[type],
  };

  if (existingCardTitles.includes(baseCard.title)) {
    let titleIndex = 2;
    while (existingCardTitles.includes(baseCard.title + " " + titleIndex)) {
      titleIndex++;
    }
    baseCard.title += " " + titleIndex;
  }

  if (type === "clock") {
    return {
      ...baseCard,
      type,
      value: 0,
      max: 6,
    };
  }

  if (type === "roll-table") {
    return {
      ...baseCard,
      type,
      lastRoll: null,
      entries: [
        { weight: 3, content: "Miss" },
        { weight: 2, content: "Partial" },
        { weight: 1, content: "Success" },
      ],
    };
  }

  if (type === "image") {
    return {
      ...baseCard,
      type,
      imageUrl: "",
    };
  }

  if (type === "dice") {
    return {
      ...baseCard,
      type,
      history: [],
    };
  }

  return {
    ...baseCard,
    type: "article",
    content: "",
  };
}
