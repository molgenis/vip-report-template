import { Component, createResource, createSignal, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Params, Sample as ApiSample } from "../api/Api";
import { Loader } from "../components/Loader";
import { SearchBox } from "../components/SearchBox";
import { Filters, FiltersChangeEvent } from "../components/filter/Filters";
import { Sort, SortEvent } from "../components/Sort";
import { Pager } from "../components/record/Pager";
import { RecordDownload } from "../components/record/RecordDownload";
import { createFilterQuery, createSearchQuery } from "../utils/query";
import api from "../Api";
import { SampleRecordTable } from "../components/SampleRecordTable";

const fetchRecords = async (params: Params) => await api.getRecords(params);
const fetchRecordsMeta = async () => await api.getRecordsMeta();

export const SampleVariants: Component = () => {
  const sample: Resource<ApiSample> = useRouteData();

  const [params, setParams] = createSignal({} as Params);

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
    <Show when={!sample.loading && !recordsMetadata.loading} fallback={<Loader />}>
      <div class="columns is-gapless">
        <div class="column">
          <nav class="breadcrumb">
            <ul>
              <li>
                <Link href="/">
                  <span class="icon">
                    <i class="fa-solid fa-home" />
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/samples">Samples</Link>
              </li>
              <li>
                <Link href={"/samples/" + sample().index.toString()}>{sample().person.individualId}</Link>
              </li>
              <li class="is-active">
                <a href="#">Variants</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="columns">
        <div class="column is-1">
          <SearchBox onInput={onSearchChange} />
          <Filters fieldMetadataContainer={recordsMetadata().info} onChange={onFiltersChange} />
        </div>
        <div class="column">
          <div class="columns">
            <div class="column is-offset-1 is-3">
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
                      {/* TODO only download current sample + pedigree members */}
                      <RecordDownload recordsMetadata={recordsMetadata()} query={params().query} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div class="columns">
            {!records.loading && (
              <SampleRecordTable
                sample={sample()}
                pedigreeSamples={[]}
                records={records().items}
                recordsMetadata={recordsMetadata()}
              />
            )}
          </div>
        </div>
      </div>
    </Show>
  );
};
