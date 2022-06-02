import { Component, createResource, createSignal } from "solid-js";
import { VariantsTable } from "../components/VariantsTable";
import { Pager } from "../components/record/Pager";
import { Params } from "@molgenis/vip-report-api/src/Api";
import { SearchBox } from "../components/SearchBox";
import { createFilterQuery, createSearchQuery } from "../utils/query";
import { InfoFilters, InfoFiltersChangeEvent } from "../components/filter/InfoFilters";
import { Sort, SortEvent } from "../components/Sort";
import { RecordDownload } from "../components/record/RecordDownload";
import { Breadcrumb } from "../components/Breadcrumb";
import {
  EMPTY_PARAMS,
  EMPTY_RECORDS_METADATA,
  EMPTY_RECORDS_PAGE,
  fetchRecords,
  fetchRecordsMeta,
} from "../utils/ApiUtils";
import { flattenFieldMetadata } from "../utils/field";

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
  const onFiltersChange = (event: InfoFiltersChangeEvent) => {
    const newParams: Params = {
      ...params(),
      page: 0,
    };
    newParams.query =
      event.filters.length > 0 ? createFilterQuery({ fields: event.filters, samplesFields: [] }) : undefined;
    setParams(newParams);
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

  return (
    <>
      <Breadcrumb items={[{ text: "Variants" }]} />
      <div class="columns">
        <div class="column is-1-fullhd is-2">
          <SearchBox onInput={onSearchChange} />
          <InfoFilters fields={flattenFieldMetadata(recordsMetadata().info)} onChange={onFiltersChange} />
        </div>
        <div class="column">
          <div class="columns">
            <div class="column is-offset-1-fullhd is-3-fullhd is-4">
              <Sort
                fields={flattenFieldMetadata(recordsMetadata().info)}
                onChange={onSortChange}
                onClear={onSortClear}
              />
            </div>
            <div class="column is-4">
              <Pager page={records().page} onPageChange={onPageChange} />
            </div>
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
          </div>
          <div class="columns">
            <VariantsTable records={records().items} recordsMetadata={recordsMetadata()} />
          </div>
        </div>
      </div>
    </>
  );
};
