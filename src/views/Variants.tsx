import { Component, Show } from "solid-js";
import { Loader } from "../components/Loader";
import { parseVariantType } from "../utils/variantType.ts";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { VariantsContainer } from "../components/VariantsContainer";
import { getConfig, getMetadata } from "./data/data";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";
import { useStore } from "../store";
import { wrapStore } from "../store/variants.ts";

export const Variants: Component<RouteSectionProps> = (props) => {
  const store = useStore();

  const variantType = () => parseVariantType(props.params.variantType);
  const config = createAsync(() => getConfig());
  const metadata = createAsync(() => getMetadata());

  return (
    <>
      <VariantBreadcrumb variantType={variantType()} />
      <Show when={config()} fallback={<Loader />}>
        {(config) => (
          <Show when={metadata()} fallback={<Loader />}>
            {(metadata) => (
              <VariantsContainer
                store={wrapStore(store, null, variantType())}
                config={config()}
                metadata={metadata()}
                variantType={variantType()}
                sample={null}
              />
            )}
          </Show>
        )}
      </Show>
    </>
  );
};
