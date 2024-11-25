import { onMount, ParentComponent } from "solid-js";
import { A, Location, Navigator, useLocation, useNavigate } from "@solidjs/router";
import { DatasetDropdown } from "./components/DatasetDropdown";
import { fetchSampleProbandIds, isDatasetSupport } from "./utils/api.ts";
import { href } from "./utils/utils.ts";
import { getMetadata } from "./views/data/data.tsx";

// export for development purposes
export function init(navigate: Navigator, location?: Location) {
  (async () => {
    document.title = `VCF Report (${(await getMetadata()).htsFile.uri})`;
    const sampleIds = await fetchSampleProbandIds();
    if (location === undefined || location.pathname === "/") {
      let components: (string | number)[];
      if (sampleIds.length === 1) {
        components = ["samples", sampleIds[0]!, "variants"];
      } else if (sampleIds.length === 0) {
        components = ["variants"];
      } else {
        components = ["samples"];
      }
      navigate(href(components));
    }
  })();
}

const App: ParentComponent = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  onMount(() => init(navigate, location));

  return (
    <>
      <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <A class="navbar-item has-text-weight-semibold" href="/" end={true}>
            Variant Interpretation Pipeline
          </A>
        </div>
        <div class="navbar-menu">
          <div class="navbar-item has-dropdown is-hoverable">
            <A class="navbar-link" href={"/"} end={true}>
              Report
            </A>
            <div class="navbar-dropdown">
              <A class="navbar-item" href={"/samples"} end={true}>
                Samples
              </A>
              <hr class="navbar-divider" />
              <A class="navbar-item" href={"/variants"} end={true}>
                Variants
              </A>
            </div>
          </div>
          {isDatasetSupport() && (
            <div class="navbar-start">
              <DatasetDropdown />
            </div>
          )}
          <div class="navbar-end">
            <A class="navbar-item" href={"/help"} end={true}>
              Help
            </A>
          </div>
        </div>
      </nav>
      <div class="container is-fluid">{props.children}</div>
    </>
  );
};

export default App;
