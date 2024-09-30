import { Component, createResource, Show } from "solid-js";
import { Loader } from "../components/Loader";
import {
  composeMetadata,
  fetchHtsFileMetadata,
  fetchPedigreeSamples,
  fetchPhenotypicFeatures,
  fetchRecordsMeta,
  fetchSampleVariantTypeIds,
} from "../utils/ApiUtils";
import { Breadcrumb, BreadCrumbItem } from "../components/Breadcrumb";
import { composeSample, getSampleItemLabel } from "../utils/sample";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { getSample } from "./data/data";
import { parseVariantType, VariantType, VariantTypeId } from "../utils/variantTypeUtils";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { VariantsContainer } from "../components/VariantsContainer";

export const SampleVariantsTyped: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const sample = createAsync(() => getSample(props.params.sampleId));
  const [variantTypeIds] = createResource(sample, fetchSampleVariantTypeIds);
  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [samplePhenotypes] = createResource(sample, fetchPhenotypicFeatures);
  const [recordsMeta] = createResource(fetchRecordsMeta);
  const [htsFileMeta] = createResource(fetchHtsFileMetadata);

  function createBreadCrumbItems(
    sample: Item<Sample>,
    variantType: VariantType,
    variantTypeIds: Set<VariantTypeId>,
  ): BreadCrumbItem[] {
    const items: BreadCrumbItem[] = [
      { href: "/samples", text: "Samples" },
      { href: `/samples/${sample.id}`, text: getSampleItemLabel(sample) },
    ];

    if (variantTypeIds.size > 1) {
      items.push({ href: `/samples/${sample.id}/variants`, text: "Variants" });
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
              <Show when={pedigreeSamples()} fallback={<Loader />}>
                {(pedigreeSamples) => (
                  <Show when={samplePhenotypes()} fallback={<Loader />}>
                    {(samplePhenotypes) => (
                      <Show when={recordsMeta()} fallback={<Loader />}>
                        {(recordsMeta) => (
                          <Show when={htsFileMeta()} fallback={<Loader />}>
                            {(htsFileMeta) => (
                              <VariantsContainer
                                metadata={composeMetadata(htsFileMeta(), recordsMeta())}
                                variantType={variantType()}
                                variantTypeIds={variantTypeIds()}
                                sample={composeSample(sample(), samplePhenotypes(), pedigreeSamples())}
                              />
                            )}
                          </Show>
                        )}
                      </Show>
                    )}
                  </Show>
                )}
              </Show>
            </>
          )}
        </Show>
      )}
    </Show>
  );
};
