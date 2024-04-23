import { onMount, ParentComponent } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
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
          <a class="navbar-item has-text-weight-semibold" href="/">
            Variant Interpretation Pipeline
          </a>
        </div>
        <div class="navbar-menu">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link" href="/">
              Report
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item" href="/samples">
                Samples
              </a>
              <hr class="navbar-divider" />
              <a class="navbar-item" href="/variants">
                Variants
              </a>
            </div>
          </div>
          {api.isDatasetSupport() && (
            <div class="navbar-start">
              <DatasetDropdown />
            </div>
          )}
          <div class="navbar-end">
            <a class="navbar-item" href="/help">
              Help
            </a>
          </div>
        </div>
      </nav>
      <div class="container is-fluid">{props.children}</div>
    </>
  );
};

export default App;
