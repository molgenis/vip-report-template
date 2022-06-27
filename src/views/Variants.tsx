import { Component, createResource, Show } from "solid-js";
import { VariantsTable } from "../components/VariantsTable";
import { Pager } from "../components/record/Pager";
import { SearchBox } from "../components/SearchBox";
import { InfoFilters } from "../components/filter/InfoFilters";
import { Sort, SortEvent } from "../components/Sort";
import { RecordDownload } from "../components/record/RecordDownload";
import { Breadcrumb } from "../components/Breadcrumb";
import { fetchHtsFileMetadata, fetchRecords, fetchRecordsMeta } from "../utils/ApiUtils";
import { flattenFieldMetadata } from "../utils/field";
import { DIRECTION_ASCENDING, DIRECTION_DESCENDING } from "../utils/sortUtils";
import { HtsFileMetadata, Params, SortPath } from "@molgenis/vip-report-api/src/Api";
import { FilterChangeEvent, FilterClearEvent } from "../components/filter/Filter";
import { useStore } from "../store";
import { createQuery, infoSortPath } from "../utils/query";
import { Loader } from "../components/Loader";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { arrayEquals } from "../utils/utils";

export const VariantsView: Component = () => {
  const [recordsMeta] = createResource(fetchRecordsMeta);
  const [htsFileMeta] = createResource(fetchHtsFileMetadata);

  return (
    <>
      <Breadcrumb items={[{ text: "Variants" }]} />
      <Show when={recordsMeta() && htsFileMeta} fallback={<Loader />}>
        <Variants recordsMeta={recordsMeta()!} htsFileMeta={htsFileMeta()!} />
      </Show>
    </>
  );
};

export const Variants: Component<{
  recordsMeta: Metadata;
  htsFileMeta: HtsFileMetadata;
}> = (props) => {
  const [state, actions] = useStore();

  const page = () => state.variants?.page;
  const pageSize = () => state.variants?.pageSize;
  const searchQuery = () => state.variants?.searchQuery;
  const filterQueries = () => state.variants?.filterQueries;
  const sort = () => state.variants?.sort;

  const onPageChange = (page: number) => actions.setVariantsPage(page);
  const onSearchChange = (search: string) => actions.setVariantsSearchQuery(search);
  const onFilterChange = (event: FilterChangeEvent) => actions.setVariantsFilterQuery(event.query);
  const onFilterClear = (event: FilterClearEvent) => actions.clearVariantsFilterQuery(event.selector);
  const onSortChange = (event: SortEvent) => actions.setVariantsSort(event.order);
  const onSortClear = () => actions.setVariantsSort(null);

  const params = (): Params => {
    return {
      query: createQuery(searchQuery(), filterQueries(), props.recordsMeta) || undefined,
      sort: sort() || undefined,
      page: page() || undefined,
      size: pageSize() || undefined,
    };
  };

  const [records] = createResource(params, fetchRecords);

  const sortOptions = () => {
    return flattenFieldMetadata(props.recordsMeta.info).flatMap((field) => [
      {
        order: { field, direction: DIRECTION_ASCENDING },
        selected:
          arrayEquals(infoSortPath(field), sort()?.property as SortPath) && sort()?.compare === DIRECTION_ASCENDING
            ? true
            : undefined,
      },
      {
        order: { field, direction: DIRECTION_DESCENDING },
        selected:
          arrayEquals(infoSortPath(field), sort()?.property as SortPath) && sort()?.compare === DIRECTION_DESCENDING
            ? true
            : undefined,
      },
    ]);
  };

  return (
    <Show when={records()} fallback={<Loader />}>
      <div class="columns">
        <div class="column is-1-fullhd is-2">
          <SearchBox onInput={onSearchChange} />
          <InfoFilters
            fields={flattenFieldMetadata(props.recordsMeta.info)}
            queries={filterQueries()}
            onChange={onFilterChange}
            onClear={onFilterClear}
          />
        </div>
        <div class="column">
          <div class="columns">
            <div class="column is-offset-1-fullhd is-3-fullhd is-4">
              <Sort options={sortOptions()} onChange={onSortChange} onClear={onSortClear} />
            </div>
            <div class="column is-4">
              <Pager page={records()!.page} onPageChange={onPageChange} />
            </div>
            <div class="column">
              <div class="columns">
                <div class="column is-10">
                  <span class="is-pulled-right" style={{ margin: "auto" }}>
                    {records()!.page.totalElements} records
                  </span>
                </div>
                <div class="column">
                  <div class="is-pulled-right">
                    <RecordDownload recordsMetadata={props.recordsMeta} query={params().query} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <VariantsTable
              records={records()!.items}
              recordsMetadata={props.recordsMeta}
              htsFileMeta={props.htsFileMeta}
            />
          </div>
        </div>
      </div>
    </Show>
  );
};
