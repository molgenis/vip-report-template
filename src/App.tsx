import { onMount, ParentComponent } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import { DatasetDropdown } from "./components/DatasetDropdown";
import { fetchSampleProbandIds, isDatasetSupport } from "./Api.ts";

const App: ParentComponent = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  onMount(() => {
    (async () => {
      document.title = `VCF Report`; // FIXME reintroduce custom name
      const sampleIds = await fetchSampleProbandIds();
      if (location.pathname === "/") {
        if (sampleIds.length === 1) {
          navigate(`/samples/${sampleIds[0]!}/variants`);
        } else if (sampleIds.length === 0) {
          navigate(`/variants`);
        } else {
          navigate(`/samples`);
        }
      }
    })().catch((err) => console.error(err));
  });

  return (
    <>
      <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <A class="navbar-item has-text-weight-semibold" href="/">
            Variant Interpretation Pipeline
          </A>
        </div>
        <div class="navbar-menu">
          <div class="navbar-item has-dropdown is-hoverable">
            <A class="navbar-link" href="/">
              Report
            </A>
            <div class="navbar-dropdown">
              <A class="navbar-item" href="/samples">
                Samples
              </A>
              <hr class="navbar-divider" />
              <A class="navbar-item" href="/variants">
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
            <A class="navbar-item" href="/help">
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
