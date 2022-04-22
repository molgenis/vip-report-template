import { Component, createResource, For, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { Loader } from "../components/Loader";
import { Item, Sample } from "../api/Api";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { fetchPedigreeSamples } from "../utils/ApiUtils";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantInfoNestedTable } from "../components/VariantInfoNestedTable";
import { Value } from "../api/vcf/ValueParser";
import { getNestedInfoFieldsWithValues } from "../utils/field";
import { VariantSampleTable } from "../components/VariantSampleTable";
import api from "../Api";

function getRecordSamples(record: Record, sample: Sample, pedigreeSamples: Sample[]) {
  return [record.s[sample.index], ...pedigreeSamples.map((pedigreeSample) => record.s[pedigreeSample.index])];
}

export const SampleVariant: Component = () => {
  const { sample, variant }: { sample: Resource<Item<Sample>>; variant: Resource<Item<Record>> } = useRouteData();
  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);

  const [recordsMetadata, recordsMetadataActions] = createResource(async () => await api.getRecordsMeta());
  recordsMetadataActions.mutate();

  return (
    <>
      <Show
        when={!sample.loading && !variant.loading && !recordsMetadata.loading && !pedigreeSamples.loading}
        fallback={<Loader />}
      >
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
                  <Link href="/samples">Samples</Link>
                </li>
                <li>
                  <Link href={"/samples/" + sample().data.index.toString()}>{sample().data.person.individualId}</Link>
                </li>
                <li>
                  <Link href={"/samples/" + sample().data.index.toString() + "/variants"}>Variants</Link>
                </li>
                <li class="is-active">
                  <a href="#">
                    {variant().data.c +
                      ":" +
                      variant().data.p.toString() +
                      " " +
                      variant()
                        .data.a.map((a) => variant().data.r + ">" + (a !== null ? a : "."))
                        .join(" / ")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <GenomeBrowser
              contig={variant().data.c}
              position={variant().data.p}
              samples={[sample().data, ...(pedigreeSamples() as Sample[])]}
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-3">
            <h1 class="title is-5">Record</h1>
            <VariantTable variant={variant().data} />
          </div>
          <div class="column is-3">
            <h1 class="title is-5">Info</h1>
            <VariantInfoTable infoValues={variant().data.n} infoFields={recordsMetadata().info} />
          </div>
          <div class="column">
            <h1 class="title is-5">Samples</h1>
            <VariantSampleTable
              formatFields={recordsMetadata().format}
              samples={[sample().data, ...pedigreeSamples()]}
              sampleValues={getRecordSamples(variant().data, sample().data, pedigreeSamples())}
              record={variant().data}
            />
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
                    sample={{ id: sample().data.index, label: sample().data.person.individualId }}
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
