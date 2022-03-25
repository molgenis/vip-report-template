import { Component, ErrorBoundary } from "solid-js";
import { Link, Route, Routes } from "solid-app-router";
import { Variants } from "./views/Variants";
import { Variant } from "./views/Variant";
import VariantData from "./views/VariantData";
import { Samples } from "./views/Samples";
import SampleData from "./views/SampleData";
import { Sample } from "./views/Sample";
import { DecisionTree } from "./views/DecisionTree";
import { SampleVariants } from "./views/SampleVariants";
import { Error } from "./components/Error";

const App: Component = () => {
  return (
    <>
      <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <span class="navbar-item has-text-weight-semibold">
            <Link href="/">VCF Report</Link>
          </span>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start">
            <Link class="navbar-item" href="/samples">
              Samples
            </Link>
            <Link class="navbar-item" href="/variants">
              Variants
            </Link>
            <Link class="navbar-item" href="/decision-tree">
              Tree
            </Link>
          </div>
        </div>
      </nav>
      <div class="container is-fluid">
        <ErrorBoundary fallback={(err) => <Error error={err as unknown} />}>
          <Routes>
            <Route path="/" element={<Variants />} />
            <Route path="/samples" element={<Samples />} />
            <Route path="/samples/:id" element={<Sample />} data={SampleData} />
            <Route path="/samples/:id/variants" element={<SampleVariants />} data={SampleData} />
            <Route path="/variants" element={<Variants />} />
            <Route path="/variants/:id" element={<Variant />} data={VariantData} />
            <Route path="/decision-tree" element={<DecisionTree />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default App;
