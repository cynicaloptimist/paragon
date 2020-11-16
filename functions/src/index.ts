import * as functions from "firebase-functions";

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
  response.sendStatus(200);
});
