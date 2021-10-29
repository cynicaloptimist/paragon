export type CardState =
  | ArticleCardState
  | ClockCardState
  | RollTableCardState
  | ImageCardState
  | DiceCardState
  | DrawingCardState;

export type ArticleCardState = BaseCardState & {
  type: "article";
  content: string;
};

export type ClockCardState = BaseCardState & {
  type: "clock";
  max: number;
  value: number;
  displayType?: "horizontal" | "radial";
};

export type RollTableCardState = BaseCardState & {
  type: "roll-table-h";
  entries: RollTableEntry[];
  rollHistory: number[];
};

export type RollTableEntry = {
  weight: number;
  content: string;
};

export type ImageCardState = BaseCardState & {
  type: "image";
  imageUrl: string;
};

export type DiceCardState = BaseCardState & {
  type: "dice";
  history: DiceRoll[];
};

export type DiceRoll = {
  expression: string;
  result: string;
  total: number;
};

export type DrawingCardState = BaseCardState & {
  type: "drawing";
  sketchJSON?: string;
};

export enum PlayerViewPermission {
  Hidden = "hidden",
  Visible = "visible",
  Interact = "interact",
}

type BaseCardState = {
  cardId: string;
  title: string;
  playerViewPermission: PlayerViewPermission;
  path?: string;
};
