import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as Url from "url";

const patreon = require("@nathanhigh/patreon");

const { patreon_config } = functions.config();

const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const jsonApiURL = patreon.jsonApiURL;

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

    const userId = request.query.state;

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

      const entitledTiers =
        userIdentity.rawJson.included
          ?.filter((include: ApiListing) => include.type === "tier")
          .map((include: ApiListing) => include.id) || [];

      functions.logger.info("Entitled Tier Ids: ", entitledTiers);

      const dbRef = admin.database().ref(`entitledTiers/${userId}`);
      await dbRef.set(entitledTiers);

      response.sendStatus(200);
    } catch (err) {
      functions.logger.error("error!", err);
      response.status(500).send(err);
    }
  }
);
