import { Component, Show } from "solid-js";
import { Loader } from "../components/Loader";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { getMetadata, getSampleById } from "./data/data";
import { parseVariantType } from "../utils/variantTypeUtils";
import { VariantsContainer } from "../components/VariantsContainer";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";

export const SampleVariants: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const metadata = createAsync(() => getMetadata());
  const sample = createAsync(() => getSampleById(props.params.sampleId));

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <>
          <VariantBreadcrumb variantType={variantType()} sample={sample()} />
          <Show when={metadata()} fallback={<Loader />}>
            {(metadata) => <VariantsContainer metadata={metadata()} variantType={variantType()} sample={sample()} />}
          </Show>
        </>
      )}
    </Show>
  );
};
