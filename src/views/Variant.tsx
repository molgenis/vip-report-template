import { Component, createResource, For, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { Loader } from "../components/Loader";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantInfoNestedTable } from "../components/VariantInfoNestedTable";
import { getNestedInfoFieldsWithValues } from "../utils/field";
import { Breadcrumb } from "../components/Breadcrumb";
import { EMPTY_RECORDS_METADATA, fetchRecordsMeta, toString } from "../utils/ApiUtils";
import { VariantRouteData } from "./data/VariantData";

export const Variant: Component = () => {
  const { variant } = useRouteData<VariantRouteData>();

  const [recordsMetadata] = createResource(fetchRecordsMeta, { initialValue: EMPTY_RECORDS_METADATA });

  return (
    <>
      <Show when={!variant.loading} fallback={<Loader />}>
        <Breadcrumb items={[{ href: "/variants", text: "Variants" }, { text: toString(variant()) }]} />
        <GenomeBrowser contig={variant().data.c} position={variant().data.p} samples={[]} />
        <div class="columns">
          <div class="column is-3">
            <h1 class="title is-5">Record</h1>
            <VariantTable variant={variant().data} />
          </div>
          <Show
            when={
              Object.values(recordsMetadata().info).filter(
                (info) => !info.nested && variant().data.n[info.id] !== undefined
              ).length > 0
            }
          >
            <div class="column is-3">
              <h1 class="title is-5">Info</h1>
              <VariantInfoTable infoValues={variant().data.n} infoFields={recordsMetadata().info} />
            </div>
          </Show>
        </div>
        <div class="columns">
          <div class="column" style="max-width: 100%">
            <For each={getNestedInfoFieldsWithValues(recordsMetadata().info, variant().data.n)}>
              {(infoField) => (
                <>
                  <h1 class="title is-5">{infoField.id}</h1>
                  <p class="mb-4">{infoField.description}</p>
                  <VariantInfoNestedTable
                    infoValue={variant().data.n[infoField.id] as unknown as Value[][]}
                    infoField={infoField}
                    record={variant()}
                    sample={null}
                  />
                </>
              )}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
};
