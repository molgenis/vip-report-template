import { Component, createResource, For, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { Loader } from "../components/Loader";
import api from "../Api";
import { Value } from "../api/vcf/ValueParser";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantInfoNestedTable } from "../components/VariantInfoNestedTable";
import { getNestedInfoFieldsWithValues } from "../utils/field";
import { Item } from "../api/Api";
import { Breadcrumb } from "../components/Breadcrumb";

export const Variant: Component = () => {
  const variant: Resource<Item<Record>> = useRouteData();

  const [recordsMetadata, recordsMetadataActions] = createResource(async () => await api.getRecordsMeta());
  recordsMetadataActions.mutate();

  return (
    <>
      <Show when={!variant.loading} fallback={<Loader />}>
        <Breadcrumb
          links={[
            { href: "/variants", label: "Variants" },
            {
              href: "#",
              label:
                variant().data.c +
                ":" +
                variant().data.p.toString() +
                " " +
                variant()
                  .data.a.map((a) => variant().data.r + ">" + (a !== null ? a : "."))
                  .join(" / "),
            },
          ]}
        ></Breadcrumb>
        <GenomeBrowser contig={variant().data.c} position={variant().data.p} samples={[]} />
      </Show>
      <Show when={!variant.loading && !recordsMetadata.loading} fallback={<Loader />}>
        <div class="columns">
          <div class="column is-3">
            <h1 class="title is-5">Record</h1>
            <VariantTable variant={variant().data} />
          </div>
          <div class="column is-3">
            <h1 class="title is-5">Info</h1>
            <VariantInfoTable infoValues={variant().data.n} infoFields={recordsMetadata().info} />
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <For each={getNestedInfoFieldsWithValues(recordsMetadata()?.info, variant().data.n)}>
              {(infoField) => (
                <>
                  <h1 class="title is-5">{infoField.id}</h1>
                  <p class="mb-4">{infoField.description}</p>
                  <VariantInfoNestedTable
                    infoValue={variant().data.n[infoField.id] as unknown as Value[][]}
                    infoField={infoField}
                    variant={{
                      id: variant().id,
                      label:
                        variant().data.c +
                        ":" +
                        variant().data.p.toString() +
                        " " +
                        variant()
                          .data.a.map((a) => variant().data.r + ">" + (a !== null ? a : "."))
                          .join(" / "),
                    }}
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
