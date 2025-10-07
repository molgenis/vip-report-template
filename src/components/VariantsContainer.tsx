import { VariantFilters } from "./VariantFilters";
import { HtsFileMetadata, Params } from "@molgenis/vip-report-api";
import { Component, createResource, Show } from "solid-js";
import { VariantType } from "../utils/variantType.ts";
import { useNavigate } from "@solidjs/router";
import { initConfig } from "../utils/config/config.ts";
import { createQuery } from "../utils/query/query.ts";
import { PageChangeEvent } from "./Pager";
import { writeVcf } from "@molgenis/vip-report-vcf";
import { fetchRecords, fetchRecordsWithoutSamples, MetadataContainer, SampleContainer } from "../utils/api.ts";
import { createVcfDownloadFilename } from "../utils/download.ts";
import { RecordsPerPageChangeEvent } from "./RecordsPerPage";
import { SortChangeEvent } from "./Sort";
import { VariantTypeChangeEvent, VariantTypeSelect } from "./VariantTypeSelect";
import { Loader } from "./Loader";
import { VariantResults } from "./VariantResults";
import { FilterChangeEvent, FilterClearEvent } from "../types/filter";
import { VariantsContainerHeader } from "./VariantsContainerHeader";
import { href } from "../utils/utils.ts";
import { getPedigreeSamples } from "../utils/sample.ts";
import { ConfigJson } from "../types/config";
import { createSort } from "../utils/query/sort.ts";
import { VariantStore } from "../store/variants.ts";

export const VariantsContainer: Component<{
  store: VariantStore;
  config: ConfigJson;
  metadata: MetadataContainer;
  variantType: VariantType;
  sample: SampleContainer | null;
}> = (props) => {
  const navigate = useNavigate();

  const config = () => initConfig(props.config, props.variantType, props.metadata, props.sample);
  const variantTypeIds = () => (props.sample !== null ? props.sample.variantTypeIds : props.metadata.variantTypeIds);
  const query = () => createQuery(config(), props.variantType, props.sample, props.store.getFilterValues());

  const defaultSort = () => config().variants.sorts.find((configSort) => configSort.selected);
  const sort = () => createSort(props.store.getSort(), defaultSort()) || undefined;
  const defaultRecordsPerPage = () => config().variants.recordsPerPage.find((option) => option.selected)?.number || 10;
  const recordsPerPage = () =>
    props.store.getPageSize() !== null ? props.store.getPageSize()! : defaultRecordsPerPage();

  const [records] = createResource(
    (): Params => ({
      query: query() || undefined,
      page: props.store.getPageNumber() || 0,
      size: recordsPerPage(),
      sort: sort(),
    }),
    props.sample !== null ? fetchRecords : fetchRecordsWithoutSamples,
  );

  const onFilterChange = (event: FilterChangeEvent) => {
    props.store.setFilterValue(event.id, event.value);
  };
  const onFilterClear = (event: FilterClearEvent) => {
    props.store.clearFilter(event.id);
  };
  const onPageChange = (event: PageChangeEvent) => {
    props.store.setPageNumber(event.page);
  };

  const onRecordsDownload = async () => {
    const samples = props.sample ? getPedigreeSamples(props.sample) : [];
    const filter = samples ? { samples: samples.map((sample) => sample.data.person.individualId) } : undefined;

    // create vcf using all records that match filters, use default sort to ensure valid vcf ordering
    const records = await fetchRecords({ query: query() || undefined, page: 0, size: Number.MAX_SAFE_INTEGER });
    const vcf = writeVcf({ metadata: props.metadata.records, data: records.items.map((item) => item.data) }, filter);

    const url = window.URL.createObjectURL(new Blob([vcf]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", createVcfDownloadFilename(props.metadata.app.htsFile as HtsFileMetadata));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const onRecordsPerPageChange = (event: RecordsPerPageChangeEvent) => {
    props.store.setPageSize(event.number);
  };
  const onSortChange = (event: SortChangeEvent) => {
    props.store.setSort(event.order);
  };
  const onSortClear = () => {
    props.store.clearSort();
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
                filterConfigs={config().variants.filters}
                filterValues={props.store.getFilterValues()}
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
                fieldConfigs={config().variants.cells}
                records={records()}
                sortOptions={config().variants.sorts}
                recordsPerPage={config().variants.recordsPerPage.map((option) => ({
                  ...option,
                  selected: option.number === recordsPerPage(),
                }))}
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
