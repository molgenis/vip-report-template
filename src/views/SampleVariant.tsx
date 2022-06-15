import { Component, createResource, For, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Loader } from "../components/Loader";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { fetchPedigreeSamples, fetchRecordsMeta, getRecordLabel } from "../utils/ApiUtils";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantInfoNestedTable } from "../components/VariantInfoNestedTable";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getNestedInfoFieldsWithValues } from "../utils/field";
import { VariantSampleTable } from "../components/VariantSampleTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { getRecordSamples } from "../utils/viewUtils";
import { SampleVariantRouteData } from "./data/SampleVariantData";
import { getSampleLabel } from "../utils/sample";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";

export const SampleVariantView: Component = () => {
  const { sample, variant } = useRouteData<SampleVariantRouteData>();

  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [recordsMeta] = createResource(fetchRecordsMeta);

  return (
    <Show when={sample() && variant()} fallback={<Loader />}>
      <Breadcrumb
        items={[
          { href: "/samples", text: "Samples" },
          { href: `/samples/${sample()!.id}`, text: getSampleLabel(sample()!) },
          { href: `/samples/${sample()!.id}/variants`, text: "Variants" },
          { text: getRecordLabel(variant()!) },
        ]}
      />
      <Show when={pedigreeSamples() && recordsMeta()} fallback={<Loader />}>
        <SampleVariant
          sample={sample()!}
          pedigreeSamples={pedigreeSamples()!.items}
          recordsMeta={recordsMeta()!}
          record={variant()!}
        />
      </Show>
    </Show>
  );
};

export const SampleVariant: Component<{
  sample: Item<Sample>;
  pedigreeSamples: Item<Sample>[];
  recordsMeta: Metadata;
  record: Item<Record>;
}> = (props) => {
  return (
    <>
      <div class="columns">
        <div class="column">
          <GenomeBrowser
            contig={props.record.data.c}
            position={props.record.data.p}
            samples={[props.sample.data, ...props.pedigreeSamples.map((item) => item.data)]}
          />
        </div>
      </div>
      <div class="columns">
        <div class="column is-3">
          <h1 class="title is-5">Record</h1>
          <VariantTable variant={props.record.data} />
        </div>
        <Show
          when={
            Object.values(props.recordsMeta.info).filter(
              (info) => !info.nested && props.record.data.n[info.id] !== undefined
            ).length > 0
          }
        >
          <div class="column is-3">
            <h1 class="title is-5">Info</h1>
            <VariantInfoTable infoValues={props.record.data.n} infoFields={props.recordsMeta.info} />
          </div>
        </Show>
        <div class="column">
          <h1 class="title is-5">Samples</h1>
          <VariantSampleTable
            formatFields={props.recordsMeta.format}
            samples={[props.sample.data, ...props.pedigreeSamples.map((item) => item.data)]}
            sampleValues={getRecordSamples(
              props.record.data,
              props.sample.data,
              props.pedigreeSamples.map((item) => item.data)
            )}
            record={props.record.data}
          />
        </div>
      </div>
      <div class="columns">
        <div class="column" style={{ "max-width": "100%" }}>
          <For each={getNestedInfoFieldsWithValues(props.recordsMeta.info, props.record.data.n)}>
            {(infoField) => (
              <>
                <h1 class="title is-5">{infoField.id}</h1>
                <p class="mb-4">{infoField.description}</p>
                <VariantInfoNestedTable
                  infoValue={props.record.data.n[infoField.id] as unknown as Value[][]}
                  infoField={infoField}
                  sample={{ id: props.sample.id, label: props.sample.data.person.individualId }}
                  record={props.record}
                />
              </>
            )}
          </For>
        </div>
      </div>
    </>
  );
};
