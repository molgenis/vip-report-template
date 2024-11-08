import { VariantFilters } from "./VariantFilters";
import { Params } from "@molgenis/vip-report-api";
import { Component, createResource, Show } from "solid-js";
import { VariantType } from "../utils/variantTypeUtils";
import { useNavigate } from "@solidjs/router";
import { initConfigVariants, initVipConfig } from "../utils/config";
import { createQuery, createVipQueryClause } from "../utils/query";
import { PageChangeEvent } from "./Pager";
import { writeVcf } from "@molgenis/vip-report-vcf";
import { fetchRecords, MetadataContainer, SampleContainer } from "../Api";
import { createDownloadFilename } from "../utils/downloadUtils";
import { RecordsPerPageChangeEvent } from "./RecordsPerPage";
import { SortChangeEvent } from "./Sort";
import { VariantTypeChangeEvent, VariantTypeSelect } from "./VariantTypeSelect";
import { Loader } from "./Loader";
import { VariantResults } from "./VariantResults";
import { FilterChangeEvent, FilterClearEvent } from "../types/filter";
import { VariantsContainerHeader } from "./VariantsContainerHeader";
import { href } from "../utils/utils.ts";
import { getPedigreeSamples } from "../utils/sample.ts";
import { ConfigStaticVariants, ConfigStaticVip } from "../types/config";
import { createSort } from "../utils/sortUtils.ts";
import { VariantStore } from "../store/variants.tsx";

export const VariantsContainer: Component<{
  store: VariantStore;
  config: ConfigStaticVariants;
  metadata: MetadataContainer;
  variantType: VariantType;
  sample: SampleContainer | null;
  vipConfig: ConfigStaticVip;
}> = (props) => {
  const navigate = useNavigate();

  const config = () => initConfigVariants(props.config, props.metadata, props.variantType, props.sample);
  const vipConfig = () => initVipConfig(props.vipConfig, props.metadata);

  const variantTypeIds = () => (props.sample !== null ? props.sample.variantTypeIds : props.metadata.variantTypeIds);

  const vipQuery = () => (props.sample != null ? createVipQueryClause(vipConfig(), props.sample) : null);
  const query = () =>
    createQuery(props.variantType, props.sample, config().filters, props.store.getFilterValues(), vipQuery());

  const sort = () =>
    createSort(
      props.store.getSort(),
      config().sort.find((configSort) => configSort.selected),
    );

  const [records] = createResource(
    (): Params => ({
      query: query() || undefined,
      page: props.store.getPageNumber() || 0,
      size: props.store.getPageSize() || 10,
      sort: sort() || undefined,
    }),
    fetchRecords,
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
    link.setAttribute("download", createDownloadFilename(props.metadata.htsFile));
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
                filterConfigs={config().filters}
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
                fieldConfigs={config().cells}
                records={records()}
                sortOptions={config().sort}
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
