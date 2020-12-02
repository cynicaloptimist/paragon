import * as functions from "firebase-functions";
import * as Url from "url";
const patreon = require("patreon");

const { patreon_config } = functions.config();

const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;

const patreonOAuthClient = patreonOAuth(
  patreon_config.client_id,
  patreon_config.client_secret
);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const patreon_login = functions.https.onRequest((request, response) => {
  if (!request.query) {
    console.warn("Login redirect called with no query parameters");
    response.sendStatus(400);
    return;
  }

  functions.logger.info("Patreon Login Redirect: ", request.query);

  const oauthGrantCode = Url.parse(request.url, true).query.code;

  patreonOAuthClient
    .getTokens(oauthGrantCode, patreon_config.redirect_url)
    .then(function (tokensResponse: { access_token: string }) {
      const patreonAPIClient = patreonAPI(tokensResponse.access_token);
      return patreonAPIClient("/current_user");
    })
    .then(function (result: { store: any }) {
      const store = result.store;
      // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
      // You can also ask for result.rawJson if you'd like to work with unparsed data
      const users = store.findAll("user").map((user: any) => user.serialize());
      functions.logger.info("Outputting users:");
      functions.logger.info(users);
      functions.logger.info("Done.");

      response.sendStatus(200);
    })
    .catch(function (err: string) {
      functions.logger.error("error!", err);
      response.status(500).send(err);
    });
});
