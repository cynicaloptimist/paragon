export const CardTypeFriendlyNames = {
  article: "Article",
  info: "Info",
  dice: "Dice",
  "roll-table-h": "Random Table",
  clock: "Clock",
  ledger: "Ledger",
  image: "Image",
  drawing: "Drawing",
  pdf: "PDF",
  frame: "Web Frame",
} as const;

export const CardTypes = Object.keys(CardTypeFriendlyNames) as CardType[];
export type CardType = keyof typeof CardTypeFriendlyNames;
