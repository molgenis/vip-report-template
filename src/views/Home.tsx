import { Component } from "solid-js";
import { Breadcrumb } from "../components/Breadcrumb";

export const Home: Component = () => {
  return (
    <>
      <Breadcrumb links={[]}></Breadcrumb>
      <div class="has-background-warning" style={{ height: "300px", width: "500px" }}>
        <p>This screen displays:</p>
        <p>- metadata</p>
        <p>- data statistics</p>
        <br />
        <p>
          This screen will automatically redirect to sample-variants screen in case of 1 proband or 0 probands and 1
          sample
        </p>
      </div>
    </>
  );
};
