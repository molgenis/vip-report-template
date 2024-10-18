import { Component, createResource, Show } from "solid-js";
import { createAsync, Navigate, RouteSectionProps } from "@solidjs/router";
import { getSampleById } from "./data/data";
import { Loader } from "../components/Loader";
import { VariantTypeId } from "../utils/variantTypeUtils";
import { fetchSampleVariantTypeIds, SampleContainer } from "../Api.ts";

export const SampleVariants: Component<RouteSectionProps> = (props) => {
  const sample = createAsync(() => getSampleById(props.params.sampleId));

  const [variantTypeIds] = createResource(sample, fetchSampleVariantTypeIds);

  function getPath(sample: SampleContainer, variantTypeIds: Set<VariantTypeId>) {
    let paramVariantType: string;
    if (variantTypeIds.size === 1) {
      paramVariantType = variantTypeIds.values().next().value;
    } else {
      paramVariantType = "all";
    }
    return `/samples/${sample.item.id}/variants/${paramVariantType}`;
  }

  return (
    <Show when={variantTypeIds()} fallback={<Loader />}>
      {(variantTypeIds) => (
        <Show when={sample()}>{(sample) => <Navigate href={getPath(sample(), variantTypeIds())} />}</Show>
      )}
    </Show>
  );
};
