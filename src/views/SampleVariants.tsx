import { Component, createMemo, createResource, Show } from "solid-js";
import { Loader } from "../components/Loader";
import {
  composeMetadata,
  fetchHtsFileMetadata,
  fetchPedigreeSamples,
  fetchPhenotypicFeatures,
  fetchRecords,
  fetchRecordsMeta,
  MetadataContainer,
} from "../utils/ApiUtils";
import { Breadcrumb, BreadCrumbItem } from "../components/Breadcrumb";
import { composeSample, getSampleLabel, SampleContainer } from "../utils/sample";
import { createAsync, RouteSectionProps, useNavigate } from "@solidjs/router";
import { getSample } from "./data/data";
import { mapVariantTypeIdToVariantType, VariantType } from "../utils/variantTypeUtils";
import { Item, Params, Sample, SortOrder } from "@molgenis/vip-report-api/src/Api";
import { VariantTypeChangeEvent, VariantTypeSelect } from "../components/VariantTypeSelect";
import { RecordsPerPageChangeEvent } from "../components/RecordsPerPage";
import { SortChangeEvent } from "../components/Sort";
import { PageChangeEvent } from "../components/record/Pager";
import api from "../Api";
import { Filter, writeVcf } from "@molgenis/vip-report-vcf/src/VcfWriter";
import {
  FilterChangeEvent,
  FilterClearEvent,
  FilterValueMap,
  SampleRecordsFilters,
} from "../components/SampleRecordsFilters";
import { createStore } from "solid-js/store";
import { createDownloadFilename } from "../utils/downloadUtils";
import { createQuery } from "../utils/query";
import { SampleRecordsResults } from "../components/SampleRecordsResults";
import { createConfig } from "../utils/config";

export const SampleVariantsView: Component<RouteSectionProps> = (props) => {
  const sample = createAsync(() => getSample(Number(props.params.sampleId)));
  const variantType = () => (props.params.variantType ? mapVariantTypeIdToVariantType(props.params.variantType) : null);

  function createBreadCrumbItems(sample: Item<Sample>, variantType: VariantType | null): BreadCrumbItem[] {
    const items: BreadCrumbItem[] = [
      { href: "/samples", text: "Samples" },
      { href: `/samples/${sample.id}`, text: getSampleLabel(sample.data) },
    ];

    if (variantType !== null) {
      items.push({ href: `/samples/${sample.id}/variants`, text: "Variants" });
      items.push({ text: variantType.label });
    } else {
      items.push({ text: "Variants" });
    }
    return items;
  }

  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [samplePhenotypes] = createResource(sample, fetchPhenotypicFeatures);
  const [recordsMeta] = createResource(fetchRecordsMeta);
  const [htsFileMeta] = createResource(fetchHtsFileMetadata);

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <>
          <Breadcrumb items={createBreadCrumbItems(sample(), variantType())} />
          <Show when={pedigreeSamples()} fallback={<Loader />}>
            {(pedigreeSamples) => (
              <Show when={samplePhenotypes()} fallback={<Loader />}>
                {(samplePhenotypes) => (
                  <Show when={recordsMeta()} fallback={<Loader />}>
                    {(recordsMeta) => (
                      <Show when={htsFileMeta()} fallback={<Loader />}>
                        {(htsFileMeta) => (
                          <SampleVariants
                            metadata={composeMetadata(htsFileMeta(), recordsMeta())}
                            sample={composeSample(sample(), samplePhenotypes(), pedigreeSamples())}
                            variantType={variantType()}
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
  );
};

export type SampleVariantsState = {
  filterValues: FilterValueMap;
  page: { number: number; size: number };
  sort?: SortOrder;
};

export const SampleVariants: Component<{
  metadata: MetadataContainer;
  sample: SampleContainer;
  variantType: VariantType | null;
}> = (props) => {
  const [state, setState] = createStore<SampleVariantsState>({ filterValues: {}, page: { number: 0, size: 10 } }); // FIXME default sort order
  const navigate = useNavigate();

  const config = () => createConfig(props.variantType, props.metadata, props.sample);

  const query = () => createQuery(props.sample, props.variantType, config().filters, state.filterValues);

  const [records] = createResource(
    (): Params => ({ query: query(), page: state.page.number, size: state.page.size, sort: state.sort }),
    fetchRecords,
  );

  const onFilterChange = (event: FilterChangeEvent) => {
    setState("filterValues", event.id, event.value);
  };
  const onFilterClear = (event: FilterClearEvent) => {
    setState("filterValues", event.id, undefined); // FIXME ESLint error: false positive?
  };
  const onPageChange = (event: PageChangeEvent) => {
    setState("page", "number", event.page);
  };
  const onRecordsDownload = () => {
    const samples = createMemo(() => [
      props.sample.item.data,
      ...props.sample.otherPedigreeSamples.map((pedigreeSample) => pedigreeSample.item.data),
    ]);
    const filter = (): Filter | undefined =>
      samples() ? { samples: samples().map((sample) => sample.person.individualId) } : undefined;

    const handler = async () => {
      // create vcf using all records that match filters, use default sort to ensure valid vcf ordering
      const records = await api.getRecords({ query: query(), page: 0, size: Number.MAX_SAFE_INTEGER });
      const vcf = writeVcf(
        { metadata: props.metadata.records, data: records.items.map((item) => item.data) },
        filter(),
      );

      const url = window.URL.createObjectURL(new Blob([vcf]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", createDownloadFilename(props.metadata.htsFile));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    handler().catch((error) => console.error(error)); // FIXME ESLint warning
  };
  const onRecordsPerPageChange = (event: RecordsPerPageChangeEvent) => {
    setState("page", { number: 0, size: event.number });
  };
  const onSortChange = (event: SortChangeEvent) => {
    setState("sort", event.order);
  };
  const onSortClear = () => {
    setState("sort", undefined);
  };
  const onVariantTypeChange = (event: VariantTypeChangeEvent) => {
    navigate(`/samples/${props.sample.item.id}/variants/${event.id}`);
  };

  return (
    <div class="columns is-1">
      <div class="column is-2-fullhd is-3">
        <Show when={props.variantType === null}>
          <div class="columns">
            <div class="column">
              <VariantTypeSelect onChange={onVariantTypeChange} />
            </div>
          </div>
        </Show>
        <div class="columns">
          <div class="column">
            <SampleRecordsFilters
              sample={props.sample}
              filterConfigs={config().filters}
              filterValues={state.filterValues}
              onFilterChange={onFilterChange}
              onFilterClear={onFilterClear}
            />
          </div>
        </div>
      </div>
      <div class="column">
        <Show when={records()} fallback={<Loader />}>
          {(records) => (
            <SampleRecordsResults
              metadata={props.metadata}
              sample={props.sample}
              fieldConfigs={config().fields}
              records={records()}
              onPageChange={onPageChange}
              onRecordsPerPageChange={onRecordsPerPageChange}
              onRecordsDownload={onRecordsDownload}
              onSortChange={onSortChange}
              onSortClear={onSortClear}
            />
          )}
        </Show>
      </div>
    </div>
  );
};
