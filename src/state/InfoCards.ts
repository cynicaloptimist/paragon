import { InfoCardState, PlayerViewPermission } from "./CardState";

export function GetWelcomeCard(): InfoCardState {
  return {
    cardId: "welcome",
    type: "info",
    title: "Welcome",
    content: [
      `Reference your TTRPG session prep with this powerful, customizable virtual GM screen.`,
      `Welcome to **Paragon Campaign Dashboard!** Add new cards from the '+' menu. There are several [card types](${
        GetCardTypesCard().cardId
      }) available.`,
      `Love the app? Get account sync and [multiple campaigns](${
        GetCampaignsCard().cardId
      }) for your support [on Patreon](https://www.patreon.com/improvedinitiative)!`,
    ].join("\n\n"),
    playerViewPermission: PlayerViewPermission.Hidden,
  };
}

export function GetCardTypesCard(): InfoCardState {
  return {
    cardId: "card-types",
    type: "info",
    title: "Card Types",
    content: [
      `**Article Cards** can contain [markdown-formatted](https://www.markdownguide.org/) text. Useful for characters, locations, read-aloud text, game rules, et cetera.`,
      `**Random Table Cards** will roll on a random table that you provide. When editing, it accepts the commonly used markdown format used in places like [/r/dndbehindthetables](https://www.reddit.com/r/BehindTheTables/).`,
      `**Dice Cards** provide a space to roll and record die rolls using the familiar [Roll20 style](https://wiki.roll20.net/Dice_Reference#Roll20_Dice_Specification) dice specification.`,
      `**Clock Cards** are inspired by the Clock mechanic of various [PbtA](https://en.wikipedia.org/wiki/Powered_by_the_Apocalypse) games. They can be used for tracking progress toward a goal or event, for example.`,
      `**Image Cards** show an image. You can drag an image from another tab straight onto an image card.`,
      `**Drawing Cards** are powered by [Excalidraw](https://excalidraw.com/). Epic Tier patrons can collaborate with their players.`,
      `---`,
      `*Additional card types can be enabled on the App Settings menu:*`,
      `**Ledger Cards** help keep track of values that change over time. Try using them for experience points, currency, treasure, encumbrance, et cetera.`,
      `**PDF Cards** are available for users with Account Sync. You can upload a PDF and share it on the Player View.`,
      `**Web Frame Cards** allow you to embed another URL in an iframe.`,
      `---`,
      `All cards can be shared with your players in the Player View. If you're a [Patreon](https://www.patreon.com/improvedinitiative) supporter at the Epic tier, you can make cards fully interactable in the Player View.
  `,
    ].join("\n\n"),

    playerViewPermission: PlayerViewPermission.Hidden,
  };
}

export function GetCampaignsCard(): InfoCardState {
  return {
    cardId: "campaigns",
    type: "info",
    title: "Campaigns",
    content: [
      `Would you like to use Paragon Campaign Dashboard for multiple TTRPG campaigns? [Epic Tier](https://www.patreon.com/join/improvedinitiative/checkout?rid=8749940) patrons can organize Cards and Dashboards by Campaign.`,
      `A Card or Dashboard with no Campaign set is part of the *default campaign* and will always be visible and available.`,
      `If you have a Campaign active, the Card and Dashboard libraries will filter to cards in that Campaign.`,
      `New Cards and Dashboards will automatically be associated with the active Campaign.`,
      `**Deleting** a Campaign will return all of its Cards and Dashboards to the *default campaign*.`,
    ].join("\n\n"),
    playerViewPermission: PlayerViewPermission.Hidden,
  };
}
