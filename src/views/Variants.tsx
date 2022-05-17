import { Component, createResource, createSignal, Show } from "solid-js";
import { VariantsTable } from "../components/VariantsTable";
import { Pager } from "../components/record/Pager";
import { Params } from "@molgenis/vip-report-api/src/Api";
import { SearchBox } from "../components/SearchBox";
import { createFilterQuery, createSearchQuery } from "../utils/query";
import { Filters, FiltersChangeEvent } from "../components/filter/Filters";
import { Sort, SortEvent } from "../components/Sort";
import { Loader } from "../components/Loader";
import { RecordDownload } from "../components/record/RecordDownload";
import { Breadcrumb } from "../components/Breadcrumb";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import {
  EMPTY_PARAMS,
  EMPTY_RECORDS_METADATA,
  EMPTY_RECORDS_PAGE,
  fetchRecords,
  fetchRecordsMeta,
} from "../utils/ApiUtils";

export const Variants: Component = () => {
  const [params, setParams] = createSignal(EMPTY_PARAMS);
  const [records] = createResource(params, fetchRecords, { initialValue: EMPTY_RECORDS_PAGE });
  const [recordsMetadata] = createResource(fetchRecordsMeta, { initialValue: EMPTY_RECORDS_METADATA });

  const onPageChange = (page: number) => setParams({ page });
  const onSearchChange = (search: string) =>
    setParams({
      ...params(),
      page: 0,
      query: search !== "" ? createSearchQuery(search, recordsMetadata()) : undefined,
    });
  const onFiltersChange = (event: FiltersChangeEvent) => {
    const newParams: Params = {
      ...params(),
      page: 0,
    };
    newParams.query = event.filters.length > 0 ? createFilterQuery(event.filters) : undefined;
    setParams(newParams);
  };

  const onSortChange = (event: SortEvent) => {
    let field: string | FieldMetadata = "p";
    if (event.fieldMetadata !== null) {
      field = event.fieldMetadata;
    }
    setParams({
      ...params(),
      page: 0,
      sort: { property: field, compare: event.ascending ? "asc" : "desc" },
    });
  };

  return (
    <Show when={!recordsMetadata.loading} fallback={<Loader />}>
      <Breadcrumb links={[{ href: "#", label: "Variants" }]}></Breadcrumb>
      <div class="columns">
        <div class="column is-1-fullhd is-2">
          <SearchBox onInput={onSearchChange} />
          <Filters fieldMetadataContainer={recordsMetadata().info} onChange={onFiltersChange} fields={[]} />
        </div>
        <div class="column">
          <div class="columns">
            <div class="column is-offset-1-full-hd is-3-fullhd is-4">
              <div class="is-pulled-left">
                <Sort fieldMetadataContainer={recordsMetadata().info} onChange={onSortChange} />
              </div>
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
                      <RecordDownload recordsMetadata={recordsMetadata()} query={params().query} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div class="columns">
            {!records.loading && <VariantsTable records={records().items} recordsMetadata={recordsMetadata()} />}
          </div>
        </div>
      </div>
    </Show>
  );
};
