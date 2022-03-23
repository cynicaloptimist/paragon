export type CardState =
  | ArticleCardState
  | InfoCardState
  | ClockCardState
  | RollTableCardState
  | ImageCardState
  | DiceCardState
  | DrawingCardState
  | PDFCardState
  | LedgerCardState;

export type ArticleCardState = BaseCardState & {
  type: "article";
  content: string;
};

export type InfoCardState = BaseCardState & {
  type: "info";
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
};

export type DiceRoll = {
  expression: string;
  result: string;
  total: number;
};

export type DrawingCardState = BaseCardState & {
  type: "drawing";
  sketchModel?: SketchModelJSON;
};

export type SketchModelJSON = {
  background: string;
  objectJSONs?: string[];
  version: string;
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
