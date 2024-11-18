import { Component, Show } from "solid-js";
import { Loader } from "../components/Loader";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { getConfig, getMetadata, getSampleById } from "./data/data";
import { parseVariantType } from "../utils/variantType.ts";
import { VariantsContainer } from "../components/VariantsContainer";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";
import { useStore } from "../store";
import { wrapStore } from "../store/variants.ts";

export const SampleVariants: Component<RouteSectionProps> = (props) => {
  const store = useStore();

  const variantType = () => parseVariantType(props.params.variantType);
  const config = createAsync(() => getConfig());
  const metadata = createAsync(() => getMetadata());
  const sample = createAsync(() => getSampleById(props.params.sampleId));

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <>
          <VariantBreadcrumb variantType={variantType()} sample={sample()} />
          <Show when={config()} fallback={<Loader />}>
            {(config) => (
              <Show when={metadata()} fallback={<Loader />}>
                {(metadata) => (
                  <VariantsContainer
                    store={wrapStore(store, sample(), variantType())}
                    config={config()}
                    metadata={metadata()}
                    variantType={variantType()}
                    sample={sample()}
                  />
                )}
              </Show>
            )}
          </Show>
        </>
      )}
    </Show>
  );
};
