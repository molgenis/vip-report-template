import { Component, createMemo, createResource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Item, Params, Sample } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "../components/Loader";
import { SearchBox } from "../components/SearchBox";
import { Sort, SortEvent } from "../components/Sort";
import { Pager } from "../components/record/Pager";
import { RecordDownload } from "../components/record/RecordDownload";
import { createQuery } from "../utils/query";
import { VariantsSampleTable } from "../components/VariantsSampleTable";
import { fetchPedigreeSamples, fetchRecords, fetchRecordsMeta } from "../utils/ApiUtils";
import { Breadcrumb } from "../components/Breadcrumb";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Filters, FiltersChangeEvent } from "../components/filter/Filters";
import { createSortOrder, DIRECTION_ASCENDING, DIRECTION_DESCENDING } from "../utils/sortUtils";
import { SampleRouteData } from "./data/SampleData";
import { useStore } from "../store";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { getSampleLabel } from "../utils/sample";

export const SampleVariantsView: Component = () => {
  const { sample } = useRouteData<SampleRouteData>();

  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [recordsMeta] = createResource(fetchRecordsMeta);

  return (
    <Show when={sample()} fallback={<Loader />}>
      <Breadcrumb
        items={[
          { href: "/samples", text: "Samples" },
          { href: `/samples/${sample()!.id}`, text: getSampleLabel(sample()!) },
          { text: "Variants" },
        ]}
      />
      <Show when={pedigreeSamples() && recordsMeta()} fallback={<Loader />}>
        <SampleVariants sample={sample()!} pedigreeSamples={pedigreeSamples()!.items} recordsMeta={recordsMeta()!} />
      </Show>
    </Show>
  );
};

export const SampleVariants: Component<{
  sample: Item<Sample>;
  pedigreeSamples: Item<Sample>[];
  recordsMeta: Metadata;
}> = (props) => {
  const [state, actions] = useStore();

  const infoFields = createMemo(() => {
    const csqNestedFields = props.recordsMeta.info.CSQ?.nested?.items;
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
    const formatFieldMap = props.recordsMeta.format;
    const includedFields = ["VIM", "VID", "DP"];
    return formatFieldMap
      ? includedFields.map((fieldId) => formatFieldMap[fieldId]).filter((field) => field !== undefined)
      : [];
  });

  const sortOptions = () =>
    infoFields().flatMap((field) => [
      {
        order: { field, direction: DIRECTION_ASCENDING },
        selected: field.id === sort()?.field.id && sort()?.direction === "asc" ? true : undefined,
      },
      {
        order: { field, direction: DIRECTION_DESCENDING },
        selected: field.id === sort()?.field.id && sort()?.direction === "desc" ? true : undefined,
      },
    ]);

  const page = () => state.samples[props.sample.id]?.variants?.page || 0;
  const pageSize = () => state.samples[props.sample.id]?.variants?.pageSize || 5;
  const searchQuery = () => state.samples[props.sample.id]?.variants?.searchQuery || null;
  const filters = () => state.samples[props.sample.id]?.variants?.filters || null; // TODO set default
  const sort = () => state.samples[props.sample.id]?.variants?.sort || null; // TODO set default

  const onPageChange = (page: number | null) => actions.setVariantsPage(props.sample, page);
  const onSearchChange = (search: string | null) => actions.setVariantsSearchQuery(props.sample, search);
  const onFiltersChange = (event: FiltersChangeEvent) => actions.setVariantsFilters(props.sample, event.filters);
  const onSortChange = (event: SortEvent) => actions.setVariantsSort(props.sample, event.order);
  const onSortClear = () => actions.setVariantsSort(props.sample, null);

  const params = (): Params => ({
    query: createQuery(searchQuery(), filters(), props.recordsMeta) || undefined,
    sort: createSortOrder(sort()) || undefined,
    page: page() || undefined,
    size: pageSize() || undefined,
  });

  const [records] = createResource(params, fetchRecords);

  return (
    <div class="columns">
      <div class="column is-1-fullhd is-2">
        <SearchBox value={searchQuery()} onInput={onSearchChange} />
        <Filters
          fields={infoFields()}
          samplesFields={[{ sample: props.sample.data, fields: formatFields() }]}
          onChange={onFiltersChange}
          sampleId={props.sample.data.person.individualId}
        />
      </div>
      <div class="column">
        <div class="columns">
          <div class="column is-offset-1-fullhd is-3-fullhd is-4">
            {infoFields().length > 0 && <Sort options={sortOptions()} onChange={onSortChange} onClear={onSortClear} />}
          </div>
          <div class="column is-4">
            <Show when={records()} fallback={<Loader />}>
              {(records) => <Pager page={records.page} onPageChange={onPageChange} />}
            </Show>
          </div>
          <div class="column">
            <div class="columns">
              <div class="column is-10">
                <Show when={records()} fallback={<Loader />}>
                  {(records) => (
                    <span class="is-pulled-right" style={{ margin: "auto" }}>
                      {records.page.totalElements} records
                    </span>
                  )}
                </Show>
              </div>
              <div class="column">
                <div class="is-pulled-right">
                  <RecordDownload
                    recordsMetadata={props.recordsMeta}
                    query={params().query}
                    samples={[props.sample.data, ...props.pedigreeSamples.map((item) => item.data)]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <Show when={records()} fallback={<Loader />}>
            {(records) => (
              <VariantsSampleTable
                item={props.sample}
                pedigreeSamples={props.pedigreeSamples}
                records={records.items}
                recordsMetadata={props.recordsMeta}
                nestedFields={infoFields()}
              />
            )}
          </Show>
        </div>
      </div>
    </div>
  );
};
