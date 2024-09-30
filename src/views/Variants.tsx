import { Component, Show } from "solid-js";
import { Loader } from "../components/Loader";
import { parseVariantType } from "../utils/variantTypeUtils";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { VariantsContainer } from "../components/VariantsContainer";
import { getMetadata } from "./data/data";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";

export const Variants: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const metadata = createAsync(() => getMetadata());

  return (
    <>
      <VariantBreadcrumb variantType={variantType()} />
      <Show when={metadata()} fallback={<Loader />}>
        {(metadata) => <VariantsContainer metadata={metadata()} variantType={variantType()} sample={null} />}
      </Show>
    </>
  );
};
