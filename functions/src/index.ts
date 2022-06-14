import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as Url from "url";

import contributors from "./thanks";

const patreon = require("@nathanhigh/patreon");

const { patreon_config } = functions.config();

const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const jsonApiURL = patreon.jsonApiURL;

const tiersWithAccountSyncEntitled = ["1322253", "1937132"];
const tiersWithEpicEntitled = ["1937132"];

admin.initializeApp();

const patreonOAuthClient = patreonOAuth(
  patreon_config.client_id,
  patreon_config.client_secret
);

type ApiListing = { type: string; id: string };

export const patreon_login = functions.https.onRequest(
  async (request, response) => {
    if (!request.query) {
      console.warn("Login redirect called with no query parameters");
      response.sendStatus(400);
      return;
    }

    functions.logger.info("Patreon Login Redirect: ", request.query);

    const oauthGrantCode = Url.parse(request.url, true).query.code;
    try {
      const tokensResponse = await patreonOAuthClient.getTokens(
        oauthGrantCode,
        patreon_config.redirect_url
      );

      const patreonAPIClient = patreonAPI(tokensResponse.access_token);
      const url = jsonApiURL(
        "/identity?include=memberships,memberships.currently_entitled_tiers"
      );
      const userIdentity = await patreonAPIClient(url);
      functions.logger.info("User: ", JSON.stringify(userIdentity.rawJson));

      const patreonId = userIdentity.rawJson.data?.id;
      const entitledTiers: string[] =
        userIdentity.rawJson.included
          ?.filter((include: ApiListing) => include.type === "tier")
          .map((include: ApiListing) => include.id) || [];

      functions.logger.info("Entitled Tier Ids: ", entitledTiers);

      const isContributor = contributors.some((c) => c.PatreonId === patreonId);

      functions.logger.info("isContributor: ", isContributor);

      const hasStorage =
        isContributor ||
        entitledTiers.some((entitledTier) =>
          tiersWithAccountSyncEntitled.includes(entitledTier)
        );
      const hasEpic =
        isContributor ||
        entitledTiers.some((entitledTier) =>
          tiersWithEpicEntitled.includes(entitledTier)
        );

      const authToken = await admin
        .auth()
        .createCustomToken(patreonId, { hasStorage, hasEpic });

      const state = JSON.parse(request.query?.state?.toString() || "null");
      const redirectUrl = new URL(state.finalRedirect);

      redirectUrl.searchParams.append("authToken", authToken);

      response.redirect(redirectUrl.toString());
    } catch (err) {
      functions.logger.error("error!", err);
      response.status(500).send(err);
    }
  }
);
