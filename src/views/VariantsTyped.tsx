import { Component, createResource, Show } from "solid-js";
import { Breadcrumb, BreadCrumbItem } from "../components/Breadcrumb";
import { Loader } from "../components/Loader";
import { parseVariantType, VariantType, VariantTypeId } from "../utils/variantTypeUtils";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { VariantsContainer } from "../components/VariantsContainer";
import { getMetadata } from "./data/data";
import { fetchVariantTypeIds } from "../Api.ts";

export const VariantsTyped: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const metadata = createAsync(() => getMetadata());
  const [variantTypeIds] = createResource(fetchVariantTypeIds);

  function createBreadCrumbItems(variantType: VariantType, variantTypeIds: Set<VariantTypeId>): BreadCrumbItem[] {
    const items: BreadCrumbItem[] = [];
    if (variantTypeIds.size > 1) {
      items.push({ href: "/variants", text: "Variants" });
      items.push({ text: variantType.label });
    } else {
      items.push({ text: "Variants" });
    }
    return items;
  }

  return (
    <Show when={variantTypeIds()} fallback={<Loader />}>
      {(variantTypeIds) => (
        <>
          <Breadcrumb items={createBreadCrumbItems(variantType(), variantTypeIds())} />
          <Show when={metadata()} fallback={<Loader />}>
            {(metadata) => (
              <VariantsContainer
                metadata={metadata()}
                variantType={variantType()}
                variantTypeIds={variantTypeIds()}
                sample={null}
              />
            )}
          </Show>
        </>
      )}
    </Show>
  );
};
