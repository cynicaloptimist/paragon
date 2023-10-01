import _ from "lodash";
import { randomString } from "../randomString";
import { AppState, EmptyState } from "./AppState";
import { InfoCardState, PlayerViewPermission } from "./CardState";
import { CardTypes } from "./CardTypes";

export function GetInfoCards() {
  const welcomeCard = GetWelcomeCard();
  const cardTypesCard = GetCardTypesCard();
  const campaignsCard = GetCampaignsCard();
  return {
    [welcomeCard.cardId]: welcomeCard,
    [cardTypesCard.cardId]: cardTypesCard,
    [campaignsCard.cardId]: campaignsCard,
  };
}

export const GetInitialState = (): AppState => {
  const firstDashboardId = randomString();
  const infoCards = GetInfoCards();
  const emptyState = EmptyState();
  return {
    ...emptyState,
    appSettings: {
      ...emptyState.appSettings,
      cardTypesInMenu: _.difference(CardTypes, [
        "info",
        "ledger",
        "pdf",
        "frame",
      ]),
    },
    cardsById: infoCards,
    dashboardsById: {
      [firstDashboardId]: {
        name: "Dashboard 1",
        openCardIds: [GetWelcomeCard().cardId],
        layoutsBySize: {
          xxl: [
            {
              i: GetWelcomeCard().cardId,
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
      }) available.\n\n` +
      `You can organize your Cards and Dashboards into [Campaigns](${
        GetCampaignsCard().cardId
      }).\n\n` +
      `Love the app? Get account sync and more for your support [on Patreon](https://www.patreon.com/improvedinitiative)!`,
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

**Image Cards** show an image. You can drag an image from another tab straight onto an image card.

**Drawing Cards** are powered by [Excalidraw](https://excalidraw.com/). Epic Tier patrons can collaborate with their players.

---

*Additional card types can be enabled on the App Settings menu:*

**Ledger Cards** help keep track of values that change over time. Try using them for experience points, currency, treasure, encumbrance, et cetera.

**PDF Cards** are available for users with Account Sync. You can upload a PDF and share it on the Player View.

**Web Frame Cards** allow you to embed another URL in an iframe.

---

All cards can be shared with your players in the Player View. If you're a [Patreon](https://www.patreon.com/improvedinitiative) supporter at the Epic tier, you can make cards fully interactable in the Player View.
`,

    playerViewPermission: PlayerViewPermission.Hidden,
  };
}

function GetCampaignsCard(): InfoCardState {
  return {
    cardId: "campaigns",
    type: "info",
    title: "Campaigns",
    content:
      `If you use Paragon Campaign Dashboard for multiple campaigns, you can associate Cards and Dashboards with an individual campaign.\n\n` +
      `If a Card or Dashboard has a Campaign set, it will only appear in the Library Sidebar if that Campaign is currently active.\n\n` +
      `If you have a Campaign active, new Cards and Dashboards will automatically be associated with that Campaign.\n\n` +
      `A Card or Dashboard with no Campaign set is part of the "default campaign" and will be visible and available in all your Campaigns.\n\n` +
      `Deleting a Campaign will return all of its Cards and Dashboards to the default campaign.`,
    playerViewPermission: PlayerViewPermission.Hidden,
  };
}
