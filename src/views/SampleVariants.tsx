import { Component, createResource, createSignal, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Item, Params, Sample as ApiSample } from "../api/Api";
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
import { Breadcrumb } from "../components/Breadcrumb";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export const SampleVariants: Component = () => {
  const sample: Resource<Item<ApiSample>> = useRouteData();

  const [params, setParams] = createSignal({ size: 20 } as Params);

  const [records, recordsActions] = createResource(params, (params) => api.getRecords(params));
  const [recordsMetadata, recordsMetadataActions] = createResource(() => api.getRecordsMeta());
  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);

  const onPageChange = (page: number) => setParams({ ...params(), page });
  const onSearchChange = (search: string) => {
    setParams({
      ...params(),
      page: 0,
      query: search !== "" ? createSearchQuery(search, recordsMetadata()) : undefined,
    });
  };
  const onFiltersChange = (event: FiltersChangeEvent) => {
    setParams({
      ...params(),
      page: 0,
      query: event.filters.length > 0 ? createFilterQuery(event.filters) : undefined,
    });
  };
  const onSortChange = (event: SortEvent) => {
    let field: string | FieldMetadata = "p";
    if (event.fieldMetadata !== null) {
      field = event.fieldMetadata;
    }
    setParams({
      ...params(),
      page: 0,
      sort: { property: field, compare: event.ascending ? "asc" : "desc" },
    });
  };

  const nestedFields: { [key: string]: string } = {
    Consequence: "Effect",
    SYMBOL: "Gene",
    InheritanceModesGene: "Inheritance Modes",
    HGVSc: "HGVS C",
    HGVSp: "HGVS P",
    CAPICE_SC: "CAPICE",
    VIPC: "VIP",
    UMCG_CL: "MVL",
    VKGL_CL: "VKGL",
    CLIN_SIG: "ClinVar",
    gnomAD_AF: "gnomAD AF",
    gnomAD_HN: "gnomAD HN",
    PUBMED: "Pubmed",
  };

  recordsActions.mutate();
  recordsMetadataActions.mutate();

  return (
    <Show when={!sample.loading && !pedigreeSamples.loading && !recordsMetadata.loading} fallback={<Loader />}>
      <Breadcrumb
        links={[
          { href: "/samples", label: "Samples" },
          { href: "/samples/" + sample().data.index.toString(), label: sample().data.person.individualId },
          { href: "#", label: "Variants" },
        ]}
      ></Breadcrumb>
      <div class="columns">
        <div class="column is-1-fullhd is-2">
          <SearchBox onInput={onSearchChange} />
          <Filters fieldMetadataContainer={recordsMetadata().info} onChange={onFiltersChange} fields={nestedFields} />
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
                        samples={[sample().data, ...pedigreeSamples()]}
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
                sample={sample().data}
                pedigreeSamples={pedigreeSamples()}
                records={records().items}
                recordsMetadata={recordsMetadata()}
                nestedFields={nestedFields}
              />
            )}
          </div>
        </div>
      </div>
    </Show>
  );
};
