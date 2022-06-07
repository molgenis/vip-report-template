import { Component, createMemo, createResource, Show } from "solid-js";
import { useRouteData, useSearchParams } from "solid-app-router";
import { SortOrder, SortPath } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "../components/Loader";
import { SearchBox } from "../components/SearchBox";
import { Sort, SortEvent } from "../components/Sort";
import { Pager } from "../components/record/Pager";
import { RecordDownload } from "../components/record/RecordDownload";
import { createFilterQuery, createSearchQuery } from "../utils/query";
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
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Filters, FiltersChangeEvent } from "../components/filter/Filters";
import { createSortOrder, Direction, DIRECTION_ASCENDING, DIRECTION_DESCENDING } from "../utils/sortUtils";
import { parseSearchParams, RecordSearchParams } from "../utils/searchParamsUtils";
import { findInfoField } from "../utils/field";
import { SampleRouteData } from "./data/SampleData";

export const SampleVariants: Component = () => {
  const { sample } = useRouteData<SampleRouteData>();

  const [searchParams, setSearchParams] = useSearchParams<RecordSearchParams>();
  const params = () => ({ size: 20, ...parseSearchParams(searchParams) });

  const [records] = createResource(params, fetchRecords, { initialValue: EMPTY_RECORDS_PAGE });
  const [recordsMetadata] = createResource(fetchRecordsMeta, { initialValue: EMPTY_RECORDS_METADATA });
  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples, { initialValue: EMPTY_SAMPLES });

  const onPageChange = (page: number) => setSearchParams({ page: page });
  const onSearchChange = (search: string) => {
    const query = search !== "" ? createSearchQuery(search, recordsMetadata()) : null;
    setSearchParams({ page: null, query: query ? JSON.stringify(query) : null });
  };

  const onFiltersChange = (event: FiltersChangeEvent) => {
    const query = createFilterQuery(event.filters);
    setSearchParams({ page: null, query: JSON.stringify(query) });
  };
  const onSortChange = (event: SortEvent) => {
    const sort = event.order !== null ? createSortOrder(event.order) : undefined;
    setSearchParams({ page: null, sort: sort ? JSON.stringify(sort) : null });
  };
  const onSortClear = () => setSearchParams({ page: null, sort: null });

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

  const formatFields = createMemo(() => {
    const formatFieldMap = recordsMetadata()?.format;
    const includedFields = ["VIM", "VID", "DP"];
    return formatFieldMap
      ? includedFields.map((fieldId) => formatFieldMap[fieldId]).filter((field) => field !== undefined)
      : [];
  });

  const sortOptions = () => {
    let selectedFieldId: string | undefined, selectedDirection: Direction;

    const sort = params().sort;
    if (sort) {
      selectedFieldId = findInfoField(recordsMetadata(), (sort as SortOrder).property as SortPath)?.id;
      selectedDirection = (sort as SortOrder).compare == "asc" ? DIRECTION_ASCENDING : DIRECTION_DESCENDING;
    } else {
      selectedFieldId = "CAPICE_SC";
      selectedDirection = DIRECTION_DESCENDING;
    }

    return infoFields().flatMap((field) => [
      {
        order: { field, direction: DIRECTION_ASCENDING },
        selected: field.id === selectedFieldId && selectedDirection === DIRECTION_ASCENDING ? true : undefined,
      },
      {
        order: { field, direction: DIRECTION_DESCENDING },
        selected: field.id === selectedFieldId && selectedDirection === DIRECTION_DESCENDING ? true : undefined,
      },
    ]);
  };

  return (
    <Show when={!sample.loading} fallback={<Loader />}>
      <Breadcrumb
        items={[
          { href: "/samples", text: "Samples" },
          { href: `/samples/${sample().data.index}`, text: sample().data.person.individualId },
          { text: "Variants" },
        ]}
      />
      <div class="columns">
        <div class="column is-1-fullhd is-2">
          <SearchBox onInput={onSearchChange} />
          <Filters
            fields={infoFields()}
            samplesFields={[{ sample: sample().data, fields: formatFields() }]}
            onChange={onFiltersChange}
            sampleId={sample().data.person.individualId}
          />
        </div>
        <div class="column">
          <div class="columns">
            <div class="column is-offset-1-fullhd is-3-fullhd is-4">
              {infoFields().length > 0 && (
                <Sort options={sortOptions()} onChange={onSortChange} onClear={onSortClear} />
              )}
            </div>
            <div class="column is-4">{<Pager page={records().page} onPageChange={onPageChange} />}</div>
            {
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
            }
          </div>
          <div class="columns">
            <Show when={!records.loading} fallback={<Loader />}>
              <VariantsSampleTable
                item={sample()}
                pedigreeSamples={pedigreeSamples()}
                records={records().items}
                recordsMetadata={recordsMetadata()}
                nestedFields={infoFields()}
              />
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};
