import { Component, createResource, Show } from "solid-js";
import { Navigate, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { fetchVariantTypeIds } from "../utils/ApiUtils";
import { VariantTypeId } from "../utils/variantTypeUtils";

export const Variants: Component<RouteSectionProps> = () => {
  const [variantTypeIds] = createResource(fetchVariantTypeIds);

  function getPath(variantTypeIds: Set<VariantTypeId>) {
    let paramVariantType: string;
    if (variantTypeIds.size === 1) {
      paramVariantType = variantTypeIds.values().next().value;
    } else {
      paramVariantType = "all";
    }
    return `/variants/${paramVariantType}`;
  }

  return (
    <Show when={variantTypeIds()} fallback={<Loader />}>
      {(variantTypeIds) => <Navigate href={getPath(variantTypeIds())} />}
    </Show>
  );
};
