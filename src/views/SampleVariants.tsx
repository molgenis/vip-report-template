import { Component, createMemo, createResource, createSignal, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Item, Params, Sample as ApiSample } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "../components/Loader";
import { SearchBox } from "../components/SearchBox";
import { Filters, FiltersChangeEvent } from "../components/filter/Filters";
import { Sort, SortEvent } from "../components/Sort";
import { Pager } from "../components/record/Pager";
import { RecordDownload } from "../components/record/RecordDownload";
import { createFilterQuery, createFormatFilterQuery, createSearchQuery } from "../utils/query";
import { VariantsSampleTable } from "../components/VariantsSampleTable";
import {
  EMPTY_RECORDS_METADATA,
  EMPTY_RECORDS_PAGE,
  EMPTY_SAMPLES,
  fetchPedigreeSamples,
  fetchRecords,
  fetchRecordsMeta,
} from "../utils/ApiUtils";
import { Breadcrumb } from "../components/Breadcrumb";
import { FormatFilters, FormatFiltersChangeEvent } from "../components/filter/FormatFilters";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export const SampleVariants: Component = () => {
  const sample: Resource<Item<ApiSample>> = useRouteData();

  const [params, setParams] = createSignal({ size: 20 } as Params);

  const [records] = createResource(params, fetchRecords, { initialValue: EMPTY_RECORDS_PAGE });
  const [recordsMetadata] = createResource(fetchRecordsMeta, { initialValue: EMPTY_RECORDS_METADATA });
  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples, { initialValue: EMPTY_SAMPLES });

  const onPageChange = (page: number) => setParams({ ...params(), page });
  const onSearchChange = (search: string) => {
    let query = null;
    if (search !== "") {
      query = createSearchQuery(search, recordsMetadata());
    }
    setParams({
      ...params(),
      page: 0,
      query: query != null ? query : undefined,
    });
  };
  const onFiltersChange = (event: FiltersChangeEvent) => {
    setParams({
      ...params(),
      page: 0,
      query: event.filters.length > 0 ? createFilterQuery(event.filters) : undefined,
    });
  };
  const onFormatFiltersChange = (event: FormatFiltersChangeEvent, sampleId: number) => {
    setParams({
      ...params(),
      page: 0,
      query: event.filters.length > 0 ? createFormatFilterQuery(event.filters, sampleId) : undefined,
    });
  };
  const onSortChange = (event: SortEvent) => {
    setParams({
      ...params(),
      page: 0,
      sort: event.field !== null ? { property: event.field, compare: event.ascending ? "asc" : "desc" } : undefined,
    });
  };
  const onSortClear = () => {
    setParams({
      ...params(),
      page: 0,
      sort: undefined,
    });
  };

  const infoFields = createMemo(() => {
    const csqNestedFields = recordsMetadata().info.CSQ?.nested?.items;
    const includedFields = [
      "Consequence",
      "SYMBOL",
      "InheritanceModesGene",
      "IncompletePenetrance",
      "HPO",
      "HGVSc",
      "HGVSp",
      "CAPICE_SC",
      "VIPC",
      "UMCG_CL",
      "VKGL_CL",
      "CLIN_SIG",
      "gnomAD_AF",
      "gnomAD_HN",
      "PUBMED",
    ];
    return csqNestedFields
      ? (includedFields
          .map((fieldId) => csqNestedFields.find((field) => field.id === fieldId))
          .filter((field) => field !== undefined) as FieldMetadata[])
      : [];
  });

  return (
    <Show when={!sample.loading && !pedigreeSamples.loading && !recordsMetadata.loading} fallback={<Loader />}>
      <Breadcrumb
        links={[
          { href: "/samples", label: "Samples" },
          { href: "/samples/" + sample().data.index.toString(), label: sample().data.person.individualId },
          { href: "#", label: "Variants" },
        ]}
      ></Breadcrumb>
      <div class="columns">
        <div class="column is-1-fullhd is-2">
          <SearchBox onInput={onSearchChange} />
          <FormatFilters
            sampleId={sample().id}
            fieldMetadataContainer={recordsMetadata().format}
            onChange={onFormatFiltersChange}
          />
          <Filters fields={infoFields()} onChange={onFiltersChange} />
        </div>
        <div class="column">
          <div class="columns">
            <div class="column is-offset-1-fullhd is-3-fullhd is-4">
              <Sort fields={infoFields()} onChange={onSortChange} onClear={onSortClear} />
            </div>
            <div class="column is-4">
              {!records.loading && <Pager page={records().page} onPageChange={onPageChange} />}
            </div>
            {!records.loading && (
              <div class="column">
                <div class="columns">
                  <div class="column is-10">
                    <span class="is-pulled-right" style={{ margin: "auto" }}>
                      {records().page.totalElements} records
                    </span>
                  </div>
                  <div class="column">
                    <div class="is-pulled-right">
                      <RecordDownload
                        recordsMetadata={recordsMetadata()}
                        query={params().query}
                        samples={[sample().data, ...pedigreeSamples()]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div class="columns">
            {!records.loading && (
              <VariantsSampleTable
                sample={sample().data}
                pedigreeSamples={pedigreeSamples()}
                records={records().items}
                recordsMetadata={recordsMetadata()}
                nestedFields={infoFields()}
              />
            )}
          </div>
        </div>
      </div>
    </Show>
  );
};
