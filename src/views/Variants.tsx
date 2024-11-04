import { Component, Show } from "solid-js";
import { Loader } from "../components/Loader";
import { parseVariantType } from "../utils/variantTypeUtils";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { VariantsContainer } from "../components/VariantsContainer";
import { getConfig, getMetadata } from "./data/data";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";
import { ConfigStaticVariants } from "../types/config";

export const Variants: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const config = createAsync(() => getConfig("variants") as Promise<ConfigStaticVariants>);
  const metadata = createAsync(() => getMetadata());

  return (
    <>
      <VariantBreadcrumb variantType={variantType()} />
      <Show when={config()} fallback={<Loader />}>
        {(config) => (
          <Show when={metadata()} fallback={<Loader />}>
            {(metadata) => (
              <VariantsContainer config={config()} metadata={metadata()} variantType={variantType()} sample={null} />
            )}
          </Show>
        )}
      </Show>
    </>
  );
};
