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
import { VariantsSampleTable } from "../components/VariantsSampleTable";
import { fetchPedigreeSamples } from "../utils/ApiUtils";

export const SampleVariants: Component = () => {
  const sample: Resource<ApiSample> = useRouteData();

  const [params, setParams] = createSignal({} as Params);

  const [records, recordsActions] = createResource(params, (params) => api.getRecords(params));
  const [recordsMetadata, recordsMetadataActions] = createResource(() => api.getRecordsMeta());
  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);

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
    <Show when={!sample.loading && !pedigreeSamples.loading && !recordsMetadata.loading} fallback={<Loader />}>
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
        <div class="column is-1-fullhd is-2">
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
                      <RecordDownload
                        recordsMetadata={recordsMetadata()}
                        query={params().query}
                        samples={[sample(), ...pedigreeSamples()]}
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
                sample={sample()}
                pedigreeSamples={pedigreeSamples()}
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
