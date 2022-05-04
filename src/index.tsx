import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "@firebase/analytics";
import "firebase/analytics";
import { firebaseConfig } from "./firebaseConfig";

import { PreventDefaultWindowDragDropEvents } from "./PreventDefaultWindowDragDropEvents";

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
logEvent(analytics, "page_view", {
  app_name: "Paragon Campaign Dashboard",
  screen_name: "index",
});

PreventDefaultWindowDragDropEvents();
const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
