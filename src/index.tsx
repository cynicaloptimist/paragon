import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

import { initializeApp, analytics } from "firebase/app";
import "firebase/analytics";
import { firebaseConfig } from "./firebaseConfig";

import { PreventDefaultWindowDragDropEvents } from "./PreventDefaultWindowDragDropEvents";

initializeApp(firebaseConfig);
analytics().logEvent("screen_view", {
  app_name: "Paragon Campaign Dashboard",
  screen_name: "index",
});

PreventDefaultWindowDragDropEvents();
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
