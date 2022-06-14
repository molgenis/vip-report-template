import { Component, createMemo, createResource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Item, Params, PhenotypicFeature, Sample } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "../components/Loader";
import { SearchBox } from "../components/SearchBox";
import { Sort, SortEvent } from "../components/Sort";
import { Pager } from "../components/record/Pager";
import { RecordDownload } from "../components/record/RecordDownload";
import { createQuery, infoSelector, sampleSelector } from "../utils/query";
import { VariantsSampleTable } from "../components/VariantsSampleTable";
import { fetchPedigreeSamples, fetchPhenotypicFeatures, fetchRecords, fetchRecordsMeta } from "../utils/ApiUtils";
import { Breadcrumb } from "../components/Breadcrumb";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Filters } from "../components/filter/Filters";
import { createSortOrder, DIRECTION_ASCENDING, DIRECTION_DESCENDING } from "../utils/sortUtils";
import { SampleRouteData } from "./data/SampleData";
import { useStore } from "../store";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { getSampleLabel } from "../utils/sample";
import { FilterChangeEvent, FilterClearEvent } from "../components/filter/Filter";

export const SampleVariantsView: Component = () => {
  const { sample } = useRouteData<SampleRouteData>();

  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [samplePhenotypes] = createResource(sample, fetchPhenotypicFeatures);
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
      <Show when={pedigreeSamples() && samplePhenotypes() && recordsMeta()} fallback={<Loader />}>
        <SampleVariants
          sample={sample()!}
          samplePhenotypes={samplePhenotypes()!}
          pedigreeSamples={pedigreeSamples()!.items}
          recordsMeta={recordsMeta()!}
        />
      </Show>
    </Show>
  );
};

export const SampleVariants: Component<{
  sample: Item<Sample>;
  samplePhenotypes: PhenotypicFeature[];
  pedigreeSamples: Item<Sample>[];
  recordsMeta: Metadata;
}> = (props) => {
  const [state, actions] = useStore();

  // state initialization - start
  actions.setVariantsPage(props.sample, 0);
  actions.setVariantsPageSize(props.sample, 20);

  const hpoField = props.recordsMeta.info?.CSQ?.nested?.items?.find((field) => field.id === "HPO");
  if (hpoField) {
    actions.setVariantsFilterQuery(props.sample, {
      selector: infoSelector(hpoField),
      operator: "any_has_any",
      args: props.samplePhenotypes.map((phenotype) => phenotype.type.id),
    });
  }

  const vimField = props.recordsMeta.format?.VIM;
  if (vimField) {
    actions.setVariantsFilterQuery(props.sample, {
      selector: sampleSelector(props.sample, vimField),
      operator: "==",
      args: 1,
    });
  }
  const dpField = props.recordsMeta.format?.DP;
  if (dpField) {
    actions.setVariantsFilterQuery(props.sample, {
      selector: sampleSelector(props.sample, dpField),
      operator: ">=",
      args: 20,
    });
  }
  const capiceScField = props.recordsMeta.info?.CSQ?.nested?.items?.find((field) => field.id === "CAPICE_SC");
  if (capiceScField) {
    actions.setVariantsSort(props.sample, { field: capiceScField, direction: DIRECTION_DESCENDING });
  }
  // state initialization - end

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

  const page = () => state.samples[props.sample.id]?.variants?.page;
  const pageSize = () => state.samples[props.sample.id]?.variants?.pageSize;
  const searchQuery = () => state.samples[props.sample.id]?.variants?.searchQuery;
  const filterQueries = () => state.samples[props.sample.id]?.variants?.filterQueries;
  const sort = () => state.samples[props.sample.id]?.variants?.sort;

  const onPageChange = (page: number) => actions.setVariantsPage(props.sample, page);
  const onSearchChange = (search: string) => actions.setVariantsSearchQuery(props.sample, search);
  const onFilterChange = (event: FilterChangeEvent) => actions.setVariantsFilterQuery(props.sample, event.query);
  const onFilterClear = (event: FilterClearEvent) => actions.clearVariantsFilterQuery(props.sample, event.selector);
  const onSortChange = (event: SortEvent) => actions.setVariantsSort(props.sample, event.order);
  const onSortClear = () => actions.setVariantsSort(props.sample, null);

  const params = (): Params => {
    return {
      query: createQuery(searchQuery(), filterQueries(), props.recordsMeta) || undefined,
      sort: createSortOrder(sort() || null) || undefined,
      page: page() || undefined,
      size: pageSize() || undefined,
    };
  };

  const [records] = createResource(params, fetchRecords);

  const sortOptions = () =>
    infoFields().flatMap((field) => [
      {
        order: { field, direction: DIRECTION_ASCENDING },
        selected: field.id === sort()?.field.id && sort()?.direction === DIRECTION_ASCENDING ? true : undefined,
      },
      {
        order: { field, direction: DIRECTION_DESCENDING },
        selected: field.id === sort()?.field.id && sort()?.direction === DIRECTION_DESCENDING ? true : undefined,
      },
    ]);

  return (
    <div class="columns">
      <div class="column is-1-fullhd is-2">
        <SearchBox value={searchQuery()} onInput={onSearchChange} />
        <Filters
          fields={infoFields()}
          samplesFields={[{ sample: props.sample.data, fields: formatFields() }]}
          queries={filterQueries()}
          onChange={onFilterChange}
          onClear={onFilterClear}
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
