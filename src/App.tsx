import { Component, ErrorBoundary, onMount } from "solid-js";
import { Link, Route, Routes, useLocation, useNavigate } from "solid-app-router";
import { Variants } from "./views/Variants";
import { Variant } from "./views/Variant";
import VariantData from "./views/data/VariantData";
import { Samples } from "./views/Samples";
import SampleData from "./views/data/SampleData";
import { Sample } from "./views/Sample";
import { VariantConsequence } from "./views/VariantConsequence";
import { SampleVariantConsequence } from "./views/SampleVariantConsequence";
import { SampleVariants } from "./views/SampleVariants";
import { Error } from "./components/Error";
import SampleVariantData from "./views/data/SampleVariantData";
import { SampleVariant } from "./views/SampleVariant";
import { Home } from "./views/Home";
import api from "./Api";
import { DatasetDropdown } from "./components/DatasetDropdown";
import SampleVariantConsequenceData from "./views/data/SampleVariantConsequenceData";
import VariantConsequenceData from "./views/data/VariantConsequenceData";

const App: Component = () => {
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
          <Link class="navbar-item has-text-weight-semibold" href="/">
            VCF Report
          </Link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <Link class="navbar-item" href="/samples">
              Samples
            </Link>
            <Link class="navbar-item" href="/variants">
              Variants
            </Link>
            {api.isDatasetSupport() && <DatasetDropdown />}
          </div>
        </div>
      </nav>
      <div class="container is-fluid">
        <ErrorBoundary fallback={(err) => <Error error={err as unknown} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/samples">
              <Route path="/" element={<Samples />} />
              <Route path="/:sampleId" data={SampleData}>
                <Route path="/" element={<Sample />} />
                <Route path="/variants">
                  <Route path="/" element={<SampleVariants />} />
                  <Route path="/:variantId" data={SampleVariantData}>
                    <Route path="/" element={<SampleVariant />} />
                    <Route path="/consequences">
                      <Route
                        path="/:consequenceId"
                        element={<SampleVariantConsequence />}
                        data={SampleVariantConsequenceData}
                      />
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="/variants">
              <Route path="/" element={<Variants />} />
              <Route path="/:variantId" data={VariantData}>
                <Route path="/" element={<Variant />} />
                <Route path="/consequences">
                  <Route path="/:consequenceId" element={<VariantConsequence />} data={VariantConsequenceData} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default App;
