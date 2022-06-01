import { Component, createMemo, createResource, createSignal, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Item, Params, Sample } from "@molgenis/vip-report-api/src/Api";
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

export const SampleVariants: Component = () => {
  const sample: Resource<Item<Sample>> = useRouteData();

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
      query: createFilterQuery(event.filters),
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

  const formatFields = createMemo(() => {
    const formatFieldMap = recordsMetadata()?.format;
    const includedFields = ["VIM", "VID", "DP"];
    return formatFieldMap
      ? includedFields.map((fieldId) => formatFieldMap[fieldId]).filter((field) => field !== undefined)
      : [];
  });

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
              {infoFields().length > 0 && <Sort fields={infoFields()} onChange={onSortChange} onClear={onSortClear} />}
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
                sample={sample().data}
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
