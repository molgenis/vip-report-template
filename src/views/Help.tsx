import { Component } from "solid-js";
import { Anchor } from "../components/Anchor";
export const Help: Component = () => {
  return (
    <>
      <span>The documentation for the Variant Interpretation Pipeline is located </span>
      <Anchor href={`https://molgenis.github.io/vip/`}>
        <span>here</span>
      </Anchor>
      <span>.</span>
    </>
  );
};
