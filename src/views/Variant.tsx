import { Component, Show } from "solid-js";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { getMetadata, getRecordById } from "./data/data";
import { parseVariantType } from "../utils/variantTypeUtils";
import { VariantContainer } from "../components/VariantContainer.tsx";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";

export const Variant: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const record = createAsync(() => getRecordById(props.params.variantId));
  const metadata = createAsync(() => getMetadata());

  return (
    <Show when={record()} fallback={<Loader />}>
      {(record) => (
        <>
          <VariantBreadcrumb variantType={variantType()} record={record()} />
          <Show when={metadata()} fallback={<Loader />}>
            {(metadata) => (
              <VariantContainer metadata={metadata()} variantType={variantType()} record={record()} sample={null} />
            )}
          </Show>
        </>
      )}
    </Show>
  );
};
