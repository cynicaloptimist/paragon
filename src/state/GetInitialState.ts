import { randomString } from "../randomString";
import { AppState, EmptyState } from "./AppState";
import { InfoCardState, PlayerViewPermission } from "./CardState";

export const GetInitialState = (): AppState => {
  const welcomeCard = GetWelcomeCard();
  const cardTypesCard = GetCardTypesCard();
  const firstDashboardId = randomString(4);
  return {
    ...EmptyState(),
    cardsById: {
      [welcomeCard.cardId]: welcomeCard,
      [cardTypesCard.cardId]: cardTypesCard,
    },
    activeDashboardId: firstDashboardId,
    dashboardsById: {
      [firstDashboardId]: {
        name: "Dashboard 1",
        openCardIds: [welcomeCard.cardId],
        layoutsBySize: {
          xxl: [
            {
              i: welcomeCard.cardId,
              h: 8,
              w: 8,
              x: 2,
              y: 0,
            },
          ],
        },
        layoutCompaction: "free",
        layoutPushCards: "none",
      },
    },
  };
};

function GetWelcomeCard(): InfoCardState {
  return {
    cardId: "welcome",
    type: "info",
    title: "Welcome",
    content:
      `Reference your TTRPG session prep with this powerful, customizable virtual GM screen. ` +
      `Welcome to **Paragon Campaign Dashboard!** Add new cards from the '+' menu. There are several [card types](${
        GetCardTypesCard().cardId
      }) available.`,
    playerViewPermission: PlayerViewPermission.Hidden,
  };
}

function GetCardTypesCard(): InfoCardState {
  return {
    cardId: "card-types",
    type: "info",
    title: "Card Types",
    content: `
**Article Cards** can contain [markdown-formatted](https://www.markdownguide.org/) text. Useful for characters, locations, read-aloud text, game rules, et cetera.

**Random Table Cards** will roll on a random table that you provide. When editing, it accepts the commonly used markdown format used in places like [/r/dndbehindthetables](https://www.reddit.com/r/BehindTheTables/).

**Dice Cards** provide a space to roll and record die rolls using the familiar [Roll20 style](https://wiki.roll20.net/Dice_Reference#Roll20_Dice_Specification) dice specification.

**Clock Cards** are inspired by the Clock mechanic of various [PbtA](https://en.wikipedia.org/wiki/Powered_by_the_Apocalypse) games. They can be used for tracking progress toward a goal or event, for example.

**Ledger Cards** help keep track of values that change over time. Try using them for experience points, currency, treasure, encumbrance, et cetera.

**Image Cards** show an image. You can drag an image from another tab straight onto an image card.
`,

    playerViewPermission: PlayerViewPermission.Hidden,
  };
}
