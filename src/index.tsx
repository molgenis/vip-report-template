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
  faCircleInfo,
  faCircleQuestion,
  faCircleXmark,
  faDownload,
  faExternalLink,
  faHome,
  faInfo,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Provider } from "./store";
import { ErrorBoundary } from "solid-js";
import { HashRouter, Route } from "@solidjs/router";
import { Home } from "./views/Home";
import { Samples } from "./views/Samples";
import { Sample } from "./views/Sample";
import { SampleVariant } from "./views/SampleVariant";
import { SampleVariantConsequence } from "./views/SampleVariantConsequence";
import { VariantsRedirect } from "./views/VariantsRedirect.tsx";
import { Variant } from "./views/Variant";
import { VariantConsequence } from "./views/VariantConsequence";
import { Help } from "./views/Help";
import { SampleVariants } from "./views/SampleVariants.tsx";
import { SampleVariantsRedirect } from "./views/SampleVariantsRedirect.tsx";
import { Variants } from "./views/Variants.tsx";
import { ErrorNotification } from "./components/ErrorNotification.tsx";

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
      <ErrorBoundary fallback={(err) => <ErrorNotification error={err} />}>
        <HashRouter root={App}>
          <Route path="/" component={Home} />
          <Route path="/samples">
            <Route path="/" component={Samples} />
            <Route path="/:sampleId">
              <Route path="/" component={Sample} />
              <Route path="/variants">
                <Route path="/" component={SampleVariantsRedirect} />
                <Route path="/:variantType">
                  <Route path="/" component={SampleVariants} />
                  <Route path="/variant">
                    <Route path="/:variantId">
                      <Route path="/" component={SampleVariant} />
                      <Route path="/consequences">
                        <Route path="/:consequenceId" component={SampleVariantConsequence} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="/variants">
            <Route path="/" component={VariantsRedirect} />
            <Route path="/:variantType">
              <Route path="/" component={Variants} />
              <Route path="/variant">
                <Route path="/:variantId">
                  <Route path="/" component={Variant} />
                  <Route path="/consequences">
                    <Route path="/:consequenceId" component={VariantConsequence} />
                  </Route>
                </Route>
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
