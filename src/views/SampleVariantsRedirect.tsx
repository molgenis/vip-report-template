import { Component, Show } from "solid-js";
import { createAsync, Navigate, RouteSectionProps } from "@solidjs/router";
import { getSampleById } from "./data/data";
import { SampleContainer } from "../Api.ts";
import { href } from "../utils/utils.ts";

/**
 * View that redirects to the variant type specific view based on the available variant types for a sample
 */
export const SampleVariantsRedirect: Component<RouteSectionProps> = (props) => {
  const sample = createAsync(() => getSampleById(props.params.sampleId));

  function getHref(sample: SampleContainer) {
    const variantTypeIds = sample.variantTypeIds;
    const variantTypeId = variantTypeIds.size === 1 ? variantTypeIds.values().next().value! : "all";
    return href(["samples", sample.item.id, "variants", variantTypeId]);
  }

  return <Show when={sample()}>{(sample) => <Navigate href={getHref(sample())} />}</Show>;
};
