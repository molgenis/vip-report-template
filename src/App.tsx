import { Component, ErrorBoundary } from "solid-js";
import { Link, Route, Routes } from "solid-app-router";
import { Variants } from "./views/Variants";
import { Variant } from "./views/Variant";
import VariantData from "./views/VariantData";
import { Samples } from "./views/Samples";
import SampleData from "./views/SampleData";
import { Sample } from "./views/Sample";
import { SampleVariants } from "./views/SampleVariants";
import { Error } from "./components/Error";
import SampleVariantData from "./views/SampleVariantData";
import { SampleVariant } from "./views/SampleVariant";
import { Home } from "./views/Home";

const App: Component = () => {
  return (
    <>
      <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <span class="navbar-item has-text-weight-semibold">VCF Report</span>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <Link class="navbar-item" href="/samples">
              Samples
            </Link>
            <Link class="navbar-item" href="/variants">
              Variants
            </Link>
          </div>
        </div>
      </nav>
      <div class="container is-fluid">
        <ErrorBoundary fallback={(err) => <Error error={err as unknown} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/samples" element={<Samples />} />
            <Route path="/samples/:sampleId" element={<Sample />} data={SampleData} />
            <Route path="/samples/:sampleId/variants" element={<SampleVariants />} data={SampleData} />
            <Route path="/samples/:sampleId/variants/:variantId" element={<SampleVariant />} data={SampleVariantData} />
            <Route path="/variants" element={<Variants />} />
            <Route path="/variants/:variantId" element={<Variant />} data={VariantData} />
          </Routes>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default App;
