/* @refresh reload */
import { render } from "solid-js/web";
import "./assets/sass/main.scss";

import App from "./App";

import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { hashIntegration, Router } from "solid-app-router";

library.add(faCircleXmark, faSearch);

window.addEventListener("DOMContentLoaded", () => {
  void dom.i2svg();
  dom.watch();
});

render(
  () => (
    <Router source={hashIntegration()}>
      <App />
    </Router>
  ),
  document.getElementById("app") as HTMLElement
);
