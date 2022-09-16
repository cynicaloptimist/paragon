export type CardState =
  | ArticleCardState
  | InfoCardState
  | ClockCardState
  | RollTableCardState
  | ImageCardState
  | DiceCardState
  | DrawingCardState
  | PDFCardState
  | LedgerCardState
  | FrameCardState;

export type ArticleCardState = BaseCardState & {
  type: "article";
  content: string;
};

export type InfoCardState = BaseCardState & {
  type: "info";
  content: string;
};

export type ClockCardDisplayType = "horizontal" | "radial" | "v-detail";

export type ClockCardState = BaseCardState & {
  type: "clock";
  max: number;
  value: number;
  displayType?: ClockCardDisplayType;
  details?: string[];
};

export type RollTableCardState = BaseCardState & {
  type: "roll-table-h";
  entries?: RollTableEntry[];
  rollHistory?: number[];
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
  history?: DiceRoll[];
  quickRolls?: string[];
  showHistoryLength?: number;
};

export type DiceRoll = {
  expression: string;
  result: string;
  total: number;
  userName?: string;
};

export type DrawingCardState = BaseCardState & {
  type: "drawing";
  sceneElementJSONs?: string[];
};

export type PDFCardState = BaseCardState & {
  type: "pdf";
  pdfUrl: string;
  currentPage: number;
};

export type LedgerCardState = BaseCardState & {
  type: "ledger";
  entries?: LedgerEntry[];
  units: string;
  isDecreasing: boolean;
};

export type LedgerEntry = {
  changeAmount: number;
  comment: string;
};

export type FrameCardState = BaseCardState & {
  type: "frame";
  frameUrl: string;
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
  themeColor?: string;
  customColor?: string;
};
