/* @refresh reload */
import { render } from "solid-js/web";
import "./assets/sass/main.scss";

import App from "./App";

import { dom } from "@fortawesome/fontawesome-svg-core";

window.addEventListener("DOMContentLoaded", () => {
  void dom.i2svg();
  dom.watch();
});

render(() => <App />, document.getElementById("app") as HTMLElement);
