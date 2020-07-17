import GridLayout from "react-grid-layout";
import { CardState, ArticleCardState } from "./CardState";
import { randomString } from "../randomString";

export type AppState = {
  openCardIds: string[];
  cardsById: CardsState;
  layouts: GridLayout.Layout[];
  cardLibraryVisibility: boolean;
  layoutCompaction: "free" | "compact";
  playerViewId: string;
};

export type CardsState = { [cardId: string]: CardState };

export const GetInitialState = (): AppState => ({
  openCardIds: ["welcome"],
  cardsById: {
    welcome: GetWelcomeCard(),
  },
  layouts: [
    {
      i: "welcome",
      h: 8,
      w: 8,
      x: 2,
      y: 0,
    },
  ],
  cardLibraryVisibility: false,
  layoutCompaction: "free",
  playerViewId: randomString(4),
});

function GetWelcomeCard(): ArticleCardState {
  return {
    cardId: "welcome",
    type: "article",
    title: "Welcome",
    content: `Welcome to Paragon Campaign Dashboard! This app provides a suite of tools to help prepare and run your tabletop RPGs. Add new cards from the '+' menu.`,
  };
}
