/* @refresh reload */
import { render } from "solid-js/web";
import "./assets/sass/main.scss";

import App from "./App";

import { dom, library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faCircleExclamation,
  faCircleXmark,
  faCircleInfo,
  faCircleQuestion,
  faDownload,
  faExternalLink,
  faHome,
  faInfo,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Provider } from "./store";
import { ErrorBoundary } from "solid-js";
import { Error } from "./components/Error";
import { HashRouter, Route } from "@solidjs/router";
import { Home } from "./views/Home";
import { Samples } from "./views/Samples";
import { Sample } from "./views/Sample";
import { SampleVariantView } from "./views/SampleVariant";
import { SampleVariantConsequenceView } from "./views/SampleVariantConsequence";
import { VariantsView } from "./views/Variants";
import { Variant } from "./views/Variant";
import { VariantConsequence } from "./views/VariantConsequence";
import { Help } from "./views/Help";
import { SampleVariantsView } from "./views/SampleVariants";

library.add(
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faCircleExclamation,
  faCircleXmark,
  faCircleInfo,
  faCircleQuestion,
  faDownload,
  faExternalLink,
  faHome,
  faInfo,
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
      <ErrorBoundary fallback={(err) => <Error error={err as unknown} />}>
        <HashRouter root={App}>
          <Route path="/" component={Home} />
          <Route path="/samples">
            <Route path="/" component={Samples} />
            <Route path="/:sampleId">
              <Route path="/" component={Sample} />
              <Route path="/variants">
                <Route path="/" component={SampleVariantsView} />
                <Route path="/:variantType">
                  <Route path="/" component={SampleVariantsView} />
                </Route>
              </Route>
              <Route path="/variant">
                <Route path="/:variantId">
                  <Route path="/" component={SampleVariantView} />
                  <Route path="/consequences">
                    <Route path="/:consequenceId" component={SampleVariantConsequenceView} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="/variants">
            <Route path="/" component={VariantsView} />
            <Route path="/:variantId">
              <Route path="/" component={Variant} />
              <Route path="/consequences">
                <Route path="/:consequenceId" component={VariantConsequence} />
              </Route>
            </Route>
          </Route>
          <Route path="/help" component={Help} />
        </HashRouter>
      </ErrorBoundary>
    </Provider>
  ),
  document.body,
);
