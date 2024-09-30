import { Component, For, Show } from "solid-js";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { Item } from "../../../vip-report-api/src/Api";
import { Record } from "../../../vip-report-vcf/src/Vcf.ts";
import { GenomeBrowser } from "./GenomeBrowser.tsx";
import { VariantTable } from "./VariantTable.tsx";
import { VariantInfoTable } from "./VariantInfoTable.tsx";
import { VariantGenotypeTable } from "./VariantGenotypeTable.tsx";
import { getNestedInfoFieldsWithValues } from "../utils/field.ts";
import { Abbr } from "./Abbr.tsx";
import { VariantInfoNestedTable } from "./VariantInfoNestedTable.tsx";
import { Value } from "../../../vip-report-vcf/src/ValueParser.ts";

export const VariantContainer: Component<{
  metadata: MetadataContainer;
  record: Item<Record>;
  sample: SampleContainer | null;
}> = (props) => {
  const samples = (): SampleContainer[] =>
    props.sample
      ? [
          props.sample,
          props.sample.maternalSample,
          props.sample.paternalSample,
          ...props.sample.otherPedigreeSamples,
        ].filter((id) => id !== null)
      : [];

  return (
    <>
      <div class="columns">
        <div class="column">
          <GenomeBrowser metadata={props.metadata} samples={samples()} record={props.record} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-3">
          <h1 class="title is-5">Record</h1>
          <VariantTable variant={props.record.data} />
        </div>
        <Show
          when={
            Object.values(props.metadata.records.info).filter(
              (info) => !info.nested && props.record.data.n[info.id] !== undefined,
            ).length > 0
          }
        >
          <div class="column is-3">
            <h1 class="title is-5">Info</h1>
            <VariantInfoTable infoMetadataContainer={props.metadata.records.info} infoContainer={props.record.data.n} />
          </div>
        </Show>
        <Show when={samples().length > 0}>
          <div class="column">
            <h1 class="title is-5">Samples</h1>
            <VariantGenotypeTable
              samples={samples()}
              formatMetadataContainer={props.metadata.records.format}
              recordSamples={props.record.data.s}
            />
          </div>
        </Show>
      </div>
      <div class="columns">
        <div class="column" style={{ "max-width": "100%" }}>
          <For each={getNestedInfoFieldsWithValues(props.metadata.records.info, props.record.data.n)}>
            {(infoField) => (
              <>
                <h1 class="title is-5">{infoField.id}</h1>
                <p class="mb-4">
                  <Abbr value={infoField.description as string} title={infoField.description as string} />
                </p>
                <VariantInfoNestedTable
                  infoValue={props.record.data.n[infoField.id] as unknown as Value[][]}
                  infoField={infoField}
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
