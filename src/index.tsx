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
  faCircleInfo,
  faCircleQuestion,
  faDownload,
  faExternalLink,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Provider } from "./store";

library.add(
  faAngleDown,
  faAngleUp,
  faCircleExclamation,
  faCircleXmark,
  faCircleInfo,
  faCircleQuestion,
  faDownload,
  faExternalLink,
  faHome,
  faSearch,
);

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
    <Provider>
      <App />
    </Provider>
  ),
  document.body,
);
