import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

import { initializeApp } from "firebase/app";
import "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

import { PreventDefaultWindowDragDropEvents } from "./PreventDefaultWindowDragDropEvents";

initializeApp(firebaseConfig);
PreventDefaultWindowDragDropEvents();
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
