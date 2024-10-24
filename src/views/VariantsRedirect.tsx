import { Component, Show } from "solid-js";
import { createAsync, Navigate, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { getMetadata } from "./data/data.tsx";
import { MetadataContainer } from "../Api.ts";
import { href } from "../utils/utils.ts";

/**
 * View that redirects to the variant type specific view based on the available variant types
 */
export const VariantsRedirect: Component<RouteSectionProps> = () => {
  const metadata = createAsync(() => getMetadata());

  function getHref(metadata: MetadataContainer) {
    const variantTypeIds = metadata.variantTypeIds;
    const variantType = variantTypeIds.size === 1 ? variantTypeIds.values().next().value! : "all";
    return href(["variants", variantType]);
  }

  return (
    <Show when={metadata()} fallback={<Loader />}>
      {(metadata) => <Navigate href={getHref(metadata())} />}
    </Show>
  );
};
