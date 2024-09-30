import { Component, createResource, Show } from "solid-js";
import { createAsync, Navigate, RouteSectionProps } from "@solidjs/router";
import { getSample } from "./data/data";
import { Loader } from "../components/Loader";
import { fetchSampleVariantTypeIds } from "../utils/ApiUtils";
import { VariantTypeId } from "../utils/variantTypeUtils";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";

export const SampleVariants: Component<RouteSectionProps> = (props) => {
  const sample = createAsync(() => getSample(props.params.sampleId));

  const [variantTypeIds] = createResource(sample, fetchSampleVariantTypeIds);

  function getPath(sample: Item<Sample>, variantTypeIds: Set<VariantTypeId>) {
    let paramVariantType: string;
    if (variantTypeIds.size === 1) {
      paramVariantType = variantTypeIds.values().next().value;
    } else {
      paramVariantType = "all";
    }
    return `/samples/${sample.id}/variants/${paramVariantType}`;
  }

  return (
    <Show when={variantTypeIds()} fallback={<Loader />}>
      {(variantTypeIds) => (
        <Show when={sample()}>{(sample) => <Navigate href={getPath(sample(), variantTypeIds())} />}</Show>
      )}
    </Show>
  );
};
