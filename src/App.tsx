import type { Component } from "solid-js";

const App: Component = () => {
  return (
    <>
      <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <span class="navbar-item has-text-weight-semibold">VCF Report</span>
        </div>
        <div class="navbar-menu">
          <div class="navbar-start" />
        </div>
      </nav>
      <div class="container is-fluid" />
    </>
  );
};

export default App;
