import { onMount, ParentComponent } from "solid-js";
import { useLocation, useNavigate, A } from "@solidjs/router";
import api from "./Api";
import { DatasetDropdown } from "./components/DatasetDropdown";

const App: ParentComponent = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  onMount(() => {
    (async () => {
      const htsFile = await api.getHtsFileMetadata();
      document.title = `VCF Report (${htsFile.uri})`;
      const samples = await api.getSamples({ query: { selector: ["proband"], operator: "==", args: true } });
      if (location.pathname === "/") {
        if (samples.page.totalElements === 1) {
          navigate(`/samples/${samples.items[0].id}/variants`);
        } else if (samples.total === 0) {
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
          {api.isDatasetSupport() && (
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
