import { Component, createResource, Show } from "solid-js";
import { Loader } from "../components/Loader";
import { Breadcrumb, BreadCrumbItem } from "../components/Breadcrumb";
import { getSampleContainerLabel } from "../utils/sample";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { getMetadata, getSampleById } from "./data/data";
import { parseVariantType, VariantType, VariantTypeId } from "../utils/variantTypeUtils";
import { VariantsContainer } from "../components/VariantsContainer";
import { fetchSampleVariantTypeIds, SampleContainer } from "../Api.ts";

export const SampleVariantsTyped: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const metadata = createAsync(() => getMetadata());
  const sample = createAsync(() => getSampleById(props.params.sampleId));
  const [variantTypeIds] = createResource(sample, fetchSampleVariantTypeIds);

  function createBreadCrumbItems(
    sample: SampleContainer,
    variantType: VariantType,
    variantTypeIds: Set<VariantTypeId>,
  ): BreadCrumbItem[] {
    const items: BreadCrumbItem[] = [
      { href: "/samples", text: "Samples" },
      { href: `/samples/${sample.item.id}`, text: getSampleContainerLabel(sample) },
    ];

    if (variantTypeIds.size > 1) {
      items.push({ href: `/samples/${sample.item.id}/variants`, text: "Variants" });
      items.push({ text: variantType.label });
    } else {
      items.push({ text: "Variants" });
    }
    return items;
  }

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <Show when={variantTypeIds()} fallback={<Loader />}>
          {(variantTypeIds) => (
            <>
              <Breadcrumb items={createBreadCrumbItems(sample(), variantType(), variantTypeIds())} />
              <Show when={metadata()} fallback={<Loader />}>
                {(metadata) => (
                  <VariantsContainer
                    metadata={metadata()}
                    variantType={variantType()}
                    variantTypeIds={variantTypeIds()}
                    sample={sample()}
                  />
                )}
              </Show>
            </>
          )}
        </Show>
      )}
    </Show>
  );
};
