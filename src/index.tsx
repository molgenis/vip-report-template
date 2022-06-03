/* @refresh reload */
import { render } from "solid-js/web";
import "./assets/sass/main.scss";

import App from "./App";

import { dom, library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faAngleUp,
  faCircleExclamation,
  faCircleXmark,
  faDownload,
  faExternalLink,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { hashIntegration, Router } from "solid-app-router";

library.add(faCircleXmark, faDownload, faHome, faSearch, faAngleDown, faAngleUp, faExternalLink, faCircleExclamation);

function processIcons() {
  void dom.i2svg();
  dom.watch();
}

if (document.readyState === "complete") {
  processIcons();
} else {
  window.addEventListener("DOMContentLoaded", processIcons);
}

render(
  () => (
    <Router source={hashIntegration()}>
      <App />
    </Router>
  ),
  document.getElementById("app") as HTMLElement
);
