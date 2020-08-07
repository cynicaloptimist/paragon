import GridLayout from "react-grid-layout";
import { CardState, ArticleCardState, PlayerViewPermission } from "./CardState";
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

export const EmptyState = (): AppState => ({
  openCardIds: [],
  cardsById: {},
  layouts: [],
  cardLibraryVisibility: false,
  layoutCompaction: "free",
  playerViewId: "",
});

export const GetInitialState = (): AppState => {
  const welcomeCard = GetWelcomeCard();
  return {
    openCardIds: [welcomeCard.cardId],
    cardsById: {
      welcome: welcomeCard,
    },
    layouts: [
      {
        i: welcomeCard.cardId,
        h: 8,
        w: 8,
        x: 2,
        y: 0,
      },
    ],
    cardLibraryVisibility: false,
    layoutCompaction: "free",
    playerViewId: randomString(4),
  };
};

function GetWelcomeCard(): ArticleCardState {
  return {
    cardId: "welcome",
    type: "article",
    title: "Welcome",
    content:
      `Reference your TTRPG session prep with this powerful, customizable virtual GM screen. ` +
      `Welcome to **Paragon Campaign Dashboard!** Add new cards from the '+' menu.`,
    playerViewPermission: PlayerViewPermission.Hidden,
  };
}
