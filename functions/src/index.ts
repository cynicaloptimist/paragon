import * as admin from "firebase-admin";
import * as functionsv1 from "firebase-functions/v1";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
const { defineString } = require("firebase-functions/params");
import * as Url from "url";

import contributors from "./thanks";

const patreon = require("@nathanhigh/patreon");

const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const jsonApiURL = patreon.jsonApiURL;

const tiersWithAccountSyncEntitled = [
  "1322253", // deprecated: "Improved Initiative"
  "8750629", // "Account Sync"
  "1937132", // deprecated: "Epic Initiative"
  "8749940", // "Epic Tier"
];

const tiersWithEpicEntitled = ["1937132", "8749940"];

admin.initializeApp();

const client_id = defineString("PATREON_CONFIG_CLIENT_ID").value();
const client_secret = defineString("PATREON_CONFIG_CLIENT_SECRET").value();
const redirect_url = defineString("PATREON_CONFIG_REDIRECT_URL").value();

const patreonOAuthClient = patreonOAuth(client_id, client_secret);

type ApiListing = { type: string; id: string };

export const patreon_login = functionsv1.https.onRequest(
  async (request, response) => {
    if (!request.query) {
      console.warn("Login redirect called with no query parameters");
      response.sendStatus(400);
      return;
    }

    functionsv1.logger.info("Patreon Login Redirect: ", request.query);

    const oauthGrantCode = Url.parse(request.url, true).query.code;
    try {
      const tokensResponse = await patreonOAuthClient.getTokens(
        oauthGrantCode,
        redirect_url
      );

      const patreonAPIClient = patreonAPI(tokensResponse.access_token);
      const url = jsonApiURL(
        "/identity?include=memberships,memberships.currently_entitled_tiers"
      );
      const userIdentity = await patreonAPIClient(url);
      functionsv1.logger.info("User: ", JSON.stringify(userIdentity.rawJson));

      const patreonId = userIdentity.rawJson.data?.id;
      const entitledTiers: string[] =
        userIdentity.rawJson.included
          ?.filter((include: ApiListing) => include.type === "tier")
          .map((include: ApiListing) => include.id) || [];

      functionsv1.logger.info("Entitled Tier Ids: ", entitledTiers);

      const isContributor = contributors.some((c) => c.PatreonId === patreonId);

      functionsv1.logger.info("isContributor: ", isContributor);

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
      functionsv1.logger.error("error!", err);
      response.status(500).send(err);
    }
  }
);

export const patreon_login_v2 = onRequest(
  { cors: true },
  async (request, response) => {
    if (!request.query) {
      console.warn("Login redirect called with no query parameters");
      response.sendStatus(400);
      return;
    }

    logger.info("Patreon Login Redirect: ", request.query);

    const oauthGrantCode = Url.parse(request.url, true).query.code;
    try {
      const tokensResponse = await patreonOAuthClient.getTokens(
        oauthGrantCode,
        redirect_url
      );

      const patreonAPIClient = patreonAPI(tokensResponse.access_token);
      const url = jsonApiURL(
        "/identity?include=memberships,memberships.currently_entitled_tiers"
      );
      const userIdentity = await patreonAPIClient(url);
      logger.info("User: ", JSON.stringify(userIdentity.rawJson));

      const patreonId = userIdentity.rawJson.data?.id;
      const entitledTiers: string[] =
        userIdentity.rawJson.included
          ?.filter((include: ApiListing) => include.type === "tier")
          .map((include: ApiListing) => include.id) || [];

      logger.info("Entitled Tier Ids: ", entitledTiers);

      const isContributor = contributors.some((c) => c.PatreonId === patreonId);

      logger.info("isContributor: ", isContributor);

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
      logger.error("error!", err);
      response.status(500).send(err);
    }
  }
);
