import { Component, createResource, For, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { Loader } from "../components/Loader";
import api from "../Api";
import { Value } from "../api/vcf/ValueParser";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantInfoNestedTable } from "../components/VariantInfoNestedTable";
import { getNestedInfoFieldsWithValues } from "../utils/field";

export const Variant: Component = () => {
  const variant: Resource<Record> = useRouteData();

  const [recordsMetadata, recordsMetadataActions] = createResource(async () => await api.getRecordsMeta());
  recordsMetadataActions.mutate();

  return (
    <>
      <Show when={!variant.loading} fallback={<Loader />}>
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
                  <Link href={"/variants"}>Variants</Link>
                </li>
                <li class="is-active">
                  <a href="#">
                    {variant().data.c +
                      ":" +
                      variant().data.p.toString() +
                      " " +
                      variant().data
                        .a.map((a) => variant().data.r + ">" + (a !== null ? a : "."))
                        .join(" / ")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
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
