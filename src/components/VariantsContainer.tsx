import { VariantFilters } from "./VariantFilters";
import { Params, SortOrder } from "@molgenis/vip-report-api/src/Api";
import { Component, createMemo, createResource, Show } from "solid-js";
import { VariantType } from "../utils/variantTypeUtils";
import { createStore, produce } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { createConfig } from "../utils/config";
import { createQuery } from "../utils/query";
import { PageChangeEvent } from "./Pager";
import { Filter, writeVcf } from "@molgenis/vip-report-vcf/src/VcfWriter";
import { fetchRecords, MetadataContainer, SampleContainer } from "../Api";
import { createDownloadFilename } from "../utils/downloadUtils";
import { RecordsPerPageChangeEvent } from "./RecordsPerPage";
import { SortChangeEvent } from "./Sort";
import { VariantTypeChangeEvent, VariantTypeSelect } from "./VariantTypeSelect";
import { Loader } from "./Loader";
import { VariantResults } from "./VariantResults";
import { FilterChangeEvent, FilterClearEvent, FilterValueMap } from "../types/filter";
import { VariantsContainerHeader } from "./VariantsContainerHeader";
import { href } from "../utils/utils.ts";

type VariantsStore = {
  filterValues: FilterValueMap;
  page: { number: number; size: number };
  sort?: SortOrder;
};

export const VariantsContainer: Component<{
  metadata: MetadataContainer;
  variantType: VariantType;
  sample: SampleContainer | null;
}> = (props) => {
  const [store, setStore] = createStore<VariantsStore>({ filterValues: {}, page: { number: 0, size: 10 } }); // FIXME default sort order
  const navigate = useNavigate();

  const config = () => createConfig(props.metadata, props.variantType, props.sample);
  const variantTypeIds = () => (props.sample !== null ? props.sample.variantTypeIds : props.metadata.variantTypeIds);

  const query = () => createQuery(props.variantType, props.sample, config().filters, store.filterValues);

  const [records] = createResource(
    (): Params => ({ query: query() || undefined, page: store.page.number, size: store.page.size, sort: store.sort }),
    fetchRecords,
  );

  const onFilterChange = (event: FilterChangeEvent) => {
    setStore(
      produce((store) => {
        store.filterValues[event.id] = event.value;
        store.page.number = 0;
      }),
    );
  };
  const onFilterClear = (event: FilterClearEvent) => {
    setStore(
      produce((store) => {
        delete store.filterValues[event.id];
        store.page.number = 0;
      }),
    );
  };
  const onPageChange = (event: PageChangeEvent) => {
    setStore("page", "number", event.page);
  };
  const onRecordsDownload = () => {
    const samples = createMemo(() =>
      props.sample
        ? [
            props.sample.item.data,
            ...props.sample.otherPedigreeSamples.map((pedigreeSample) => pedigreeSample.item.data),
          ]
        : [],
    );
    const filter = (): Filter | undefined =>
      samples() ? { samples: samples().map((sample) => sample.person.individualId) } : undefined;

    const handler = async () => {
      // create vcf using all records that match filters, use default sort to ensure valid vcf ordering
      const records = await fetchRecords({ query: query() || undefined, page: 0, size: Number.MAX_SAFE_INTEGER });
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
    setStore("page", { number: 0, size: event.number });
  };
  const onSortChange = (event: SortChangeEvent) => {
    setStore(
      produce((store) => {
        store.sort = event.order;
      }),
    );
  };
  const onSortClear = () => {
    setStore("sort", undefined);
  };
  const onVariantTypeChange = (event: VariantTypeChangeEvent) => {
    const components = props.sample !== null ? ["samples", props.sample.item.id] : [];
    components.push("variants", event.id);
    navigate(href(components));
  };

  return (
    <>
      <div class="columns is-1 mb-1">
        <div class="column is-offset-2-fullhd is-offset-3">
          <VariantsContainerHeader sample={props.sample} />
        </div>
      </div>
      <div class="columns is-1">
        <div class="column is-2-fullhd is-3">
          <Show when={variantTypeIds().size > 1}>
            <div class="columns">
              <div class="column">
                <VariantTypeSelect
                  value={props.variantType}
                  variantTypeIds={variantTypeIds()}
                  onChange={onVariantTypeChange}
                />
              </div>
            </div>
          </Show>
          <div class="columns">
            <div class="column">
              <VariantFilters
                filterConfigs={config().filters}
                filterValues={store.filterValues}
                onFilterChange={onFilterChange}
                onFilterClear={onFilterClear}
              />
            </div>
          </div>
        </div>
        <div class="column">
          <Show when={records()} fallback={<Loader />}>
            {(records) => (
              <VariantResults
                metadata={props.metadata}
                fieldConfigs={config().cells}
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
    </>
  );
};
