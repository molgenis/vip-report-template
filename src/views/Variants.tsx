import type { Component } from "solid-js";
import { createResource, createSignal } from "solid-js";
import { RecordTable } from "../components/RecordTable";
import { Pager } from "../components/record/Pager";
import { Params } from "../api/Api";
import { SearchBox } from "../components/SearchBox";
import { createFilterQuery, createSearchQuery } from "../utils/query";
import { Filters, FiltersChangeEvent } from "../components/Filters";
import { Sort, SortEvent } from "../components/Sort";
import api from "../Api";

const fetchRecords = async (params: Params) => await api.getRecords(params);
const fetchRecordsMeta = async () => await api.getRecordsMeta();

export const Variants: Component = () => {
  const [params, setParams] = createSignal({});

  const [records, recordsActions] = createResource(params, fetchRecords);
  const [recordsMetadata, recordsMetadataActions] = createResource(fetchRecordsMeta);

  const onPageChange = (page: number) => setParams({ page });
  const onSearchChange = (search: string) =>
    setParams({
      page: 0,
      query: search !== "" ? createSearchQuery(search, recordsMetadata()) : undefined,
    });
  const onFiltersChange = (event: FiltersChangeEvent) => {
    const newParams: Params = {
      ...params,
      page: 0,
    };
    newParams.query = event.filters.length > 0 ? createFilterQuery(event.filters) : undefined;
    setParams(newParams);
  };
  const onSortChange = (event: SortEvent) => {
    // FIXME sort on actual field (probably requires API sort fix?)
    setParams({
      page: 0,
      sort: { property: "p", compare: event.ascending ? "asc" : "desc" },
    });
  };

  recordsActions.mutate();
  recordsMetadataActions.mutate();

  return (
    <>
      <div class="columns">
        <div class="column is-2 is-offset-2">
          {!recordsMetadata.loading && <Sort fieldMetadataContainer={recordsMetadata().info} onChange={onSortChange} />}
        </div>
        <div class="column is-4 is-offset-1">
          {!records.loading && <Pager page={records().page} onPageChange={onPageChange} />}
        </div>
        <div class="column is-2 is-offset-1">
          {!records.loading && <span class="is-pulled-right">{records().page.totalElements} records</span>}
        </div>
      </div>
      <div class="columns">
        <div class="column is-2">
          <SearchBox onInput={onSearchChange} />
          {!recordsMetadata.loading && (
            <Filters fieldMetadataContainer={recordsMetadata().info} onChange={onFiltersChange} />
          )}
        </div>
        <div class="column is-10">
          {!records.loading && !recordsMetadata.loading && (
            <RecordTable records={records().items} recordsMetadata={recordsMetadata()} />
          )}
        </div>
      </div>
    </>
  );
};
