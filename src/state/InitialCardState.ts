import { CardState, PlayerViewPermission } from "./CardState";
import { CardType, CardTypeFriendlyNames } from "./CardTypes";

export function InitialCardState(
  cardId: string,
  type: CardType,
  existingCardTitles: string[],
  campaignId: string | undefined
): CardState {
  const baseCard = {
    cardId,
    playerViewPermission: PlayerViewPermission.Visible,
    title: CardTypeFriendlyNames[type],
    campaignId,
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

  if (type === "roll-table-h") {
    return {
      ...baseCard,
      type,
      rollHistory: [],
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

  if (type === "drawing") {
    return {
      ...baseCard,
      type,
    };
  }

  if (type === "pdf") {
    return {
      ...baseCard,
      type,
      pdfUrl: "",
      currentPage: 1,
    };
  }

  if (type === "ledger") {
    return {
      ...baseCard,
      type,
      entries: [],
      units: "",
      isDecreasing: false,
    };
  }

  if (type === "frame") {
    return {
      ...baseCard,
      type,
      frameUrl: "",
    };
  }

  return {
    ...baseCard,
    type: "article",
    content: "",
  };
}
