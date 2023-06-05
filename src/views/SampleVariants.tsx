import { Component, createMemo, createResource, Show } from "solid-js";
import { useRouteData } from "@solidjs/router";
import { HtsFileMetadata, Item, Params, PhenotypicFeature, Sample, SortPath } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "../components/Loader";
import { SearchBox } from "../components/SearchBox";
import { Sort, SortEvent } from "../components/Sort";
import { Pager } from "../components/record/Pager";
import { RecordDownload } from "../components/record/RecordDownload";
import { createSampleQuery, infoSelector, infoSortPath, sampleSelector, selector, selectorKey } from "../utils/query";
import { VariantsSampleTable } from "../components/VariantsSampleTable";
import {
  fetchHtsFileMetadata,
  fetchPedigreeSamples,
  fetchPhenotypicFeatures,
  fetchRecords,
  fetchRecordsMeta,
} from "../utils/ApiUtils";
import { Breadcrumb } from "../components/Breadcrumb";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent, Filters } from "../components/filter/Filters";
import { DIRECTION_ASCENDING, DIRECTION_DESCENDING } from "../utils/sortUtils";
import { SampleRouteData } from "./data/SampleData";
import { useStore } from "../store";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import { getSampleLabel } from "../utils/sample";
import { arrayEquals } from "../utils/utils";
import { getAllelicBalanceQuery } from "../components/filter/FilterAllelicBalance";
import { RecordsPerPage, RecordsPerPageEvent } from "../components/RecordsPerPage";

export const SampleVariantsView: Component = () => {
  const { sample } = useRouteData<SampleRouteData>();

  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [samplePhenotypes] = createResource(sample, fetchPhenotypicFeatures);
  const [recordsMeta] = createResource(fetchRecordsMeta);
  const [htsFileMeta] = createResource(fetchHtsFileMetadata);

  return (
    <Show when={sample()} fallback={<Loader />}>
      <Breadcrumb
        items={[
          { href: "/samples", text: "Samples" },
          { href: `/samples/${sample()!.id}`, text: getSampleLabel(sample()!) },
          { text: "Variants" },
        ]}
      />
      <Show when={pedigreeSamples() && samplePhenotypes() && recordsMeta() && htsFileMeta()} fallback={<Loader />}>
        <SampleVariants
          sample={sample()!}
          samplePhenotypes={samplePhenotypes()!}
          pedigreeSamples={pedigreeSamples()!.items}
          recordsMeta={recordsMeta()!}
          htsFileMeta={htsFileMeta()!}
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
  htsFileMeta: HtsFileMetadata;
}> = (props) => {
  const [state, actions] = useStore();

  function getStateVariants() {
    return state.sampleVariants ? state.sampleVariants[props.sample.id]?.variants : undefined;
  }

  // state initialization - start
  if (getStateVariants()?.page === undefined) {
    actions.setSampleVariantsPage(props.sample, 0);
  }
  if (getStateVariants()?.pageSize === undefined) {
    actions.setSampleVariantsPageSize(props.sample, 20);
  }

  if (getStateVariants()?.filterQueries === undefined) {
    const hpoField = props.recordsMeta.info?.CSQ?.nested?.items?.find((field) => field.id === "HPO");
    if (hpoField && props.samplePhenotypes.length > 0) {
      const selectorHpo = infoSelector(hpoField);
      actions.setSampleVariantsFilterQuery(
        props.sample,
        {
          selector: selectorHpo,
          operator: "any_has_any",
          args: props.samplePhenotypes.map((phenotype) => phenotype.type.id),
        },
        selectorKey(selectorHpo)
      );
    }

    const vimField = props.recordsMeta.format?.VIM;
    if (vimField) {
      const selectorVim = sampleSelector(props.sample, vimField);
      actions.setSampleVariantsFilterQuery(
        props.sample,
        {
          operator: "or",
          args: [
            {
              selector: selectorVim,
              operator: "==",
              args: 1,
            },
            {
              selector: selectorVim,
              operator: "==",
              args: null,
            },
            {
              selector: selectorVim,
              operator: "==",
              args: undefined,
            },
          ],
        },
        selectorKey(selectorVim)
      );
    }
    const gqField = props.recordsMeta.format?.GQ;
    if (gqField) {
      const selectorGq = sampleSelector(props.sample, gqField);
      actions.setSampleVariantsFilterQuery(
        props.sample,
        {
          selector: selectorGq,
          operator: ">=",
          args: 20,
        },
        selectorKey(selectorGq)
      );
    }
    const viabField = props.recordsMeta.format?.VIAB;
    if (viabField) {
      actions.setSampleVariantsFilterQuery(
        props.sample,
        getAllelicBalanceQuery(props.sample.data.index),
        selectorKey(["s", props.sample.data.index, ...selector(viabField)])
      );
    }
  }

  if (getStateVariants()?.sort === undefined) {
    const capiceScField = props.recordsMeta.info?.CSQ?.nested?.items?.find((field) => field.id === "CAPICE_SC");
    if (capiceScField) {
      actions.setSampleVariantsSort(props.sample, {
        property: infoSortPath(capiceScField),
        compare: DIRECTION_DESCENDING,
      });
    }
  }
  // state initialization - end

  const infoFields = createMemo(() => {
    const csqNestedFields = props.recordsMeta.info.CSQ?.nested?.items;
    const includedFields = [
      "Consequence",
      "SYMBOL",
      "InheritanceModesGene",
      "HPO",
      "Zscore",
      "HGVSc",
      "HGVSp",
      "CAPICE_SC",
      "VIPC",
      "UMCG_CL",
      "VKGL_CL",
      "clinVar_CLNSIG",
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
    const includedFields = ["VIM", "VID", "GQ", "VIAB", "GT", "DP"];
    return formatFieldMap
      ? includedFields.map((fieldId) => formatFieldMap[fieldId]).filter((field) => field !== undefined)
      : [];
  });

  const page = () => getStateVariants()?.page;
  const pageSize = () => getStateVariants()?.pageSize;
  const searchQuery = () => getStateVariants()?.searchQuery;
  const filterQueries = () => getStateVariants()?.filterQueries;
  const sort = () => getStateVariants()?.sort;

  const onPageChange = (page: number) => actions.setSampleVariantsPage(props.sample, page);
  const onSearchChange = (search: string) => actions.setSampleVariantsSearchQuery(props.sample, search);
  const onFilterChange = (event: FilterChangeEvent) =>
    actions.setSampleVariantsFilterQuery(props.sample, event.query, event.key);
  const onFilterClear = (event: FilterClearEvent) => actions.clearSampleVariantsFilterQuery(props.sample, event.key);
  const onSortChange = (event: SortEvent) => actions.setSampleVariantsSort(props.sample, event.order);
  const onSortClear = () => actions.setSampleVariantsSort(props.sample, null);
  const onRecordsPerPageChange = (event: RecordsPerPageEvent) =>
    actions.setSampleVariantsPageSize(props.sample, event.number);

  const params = (): Params => {
    return {
      query: createSampleQuery(props.sample, searchQuery(), filterQueries(), props.recordsMeta) || undefined,
      sort: sort() || undefined,
      page: page() || undefined,
      size: pageSize() || undefined,
    };
  };

  const [records] = createResource(params, fetchRecords);

  const sortOptions = () =>
    infoFields().flatMap((field) => [
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

  return (
    <div class="columns is-variable is-1">
      <div class="column is-1-fullhd is-2">
        <SearchBox value={searchQuery()} onInput={onSearchChange} />
        <Filters
          fields={infoFields()}
          samplesFields={[{ sample: props.sample, fields: formatFields() }]}
          queries={filterQueries()}
          onChange={onFilterChange}
          onClear={onFilterClear}
        />
      </div>
      <div class="column">
        <div class="columns is-gapless">
          <div class="column is-offset-1-fullhd is-3-fullhd is-4">
            <Show when={records()} fallback={<Loader />} keyed>
              {(records) => (
                <span class="is-pulled-left inline-control-text ml-2">{records.page.totalElements} records</span>
              )}
            </Show>
          </div>
          <div class="column is-4">
            <Show when={records()} fallback={<Loader />} keyed>
              {(records) => <Pager page={records.page} onPageChange={onPageChange} />}
            </Show>
          </div>
          <div class="column">
            <div class="field is-grouped is-grouped-right">
              {infoFields().length > 0 && (
                <Sort options={sortOptions()} onChange={onSortChange} onClear={onSortClear} />
              )}
              <RecordDownload
                recordsMetadata={props.recordsMeta}
                query={params().query}
                samples={[props.sample.data, ...props.pedigreeSamples.map((item) => item.data)]}
              />
            </div>
          </div>
        </div>
        <div class="columns is-gapless">
          <div class="column is-full">
            <Show when={records()} fallback={<Loader />} keyed>
              {(records) => (
                <>
                  <VariantsSampleTable
                    item={props.sample}
                    pedigreeSamples={props.pedigreeSamples}
                    records={records.items}
                    recordsMetadata={props.recordsMeta}
                    nestedFields={infoFields()}
                    htsFileMeta={props.htsFileMeta}
                  />
                  <div class="columns is-gapless">
                    <div class="column">
                      <div class="field is-grouped is-grouped-right">
                        <RecordsPerPage
                          initialValue={getStateVariants()?.pageSize || 20}
                          onChange={onRecordsPerPageChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};
