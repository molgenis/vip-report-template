import { Component, For, Show } from "solid-js";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { Item, Sample } from "../../../vip-report-api/src/Api";
import { Record } from "../../../vip-report-vcf/src/Vcf.ts";
import { GenomeBrowser } from "./GenomeBrowser.tsx";
import { VariantTable } from "./VariantTable.tsx";
import { VariantInfoTable } from "./VariantInfoTable.tsx";
import { VariantGenotypeTable } from "./VariantGenotypeTable.tsx";
import { RecordsTable } from "./RecordsTable.tsx";
import { ConfigCells } from "../types/config";
import { VariantType } from "../utils/variantTypeUtils.ts";
import { createConfigFields } from "../utils/configFields.ts";
import { createFieldMap } from "../utils/utils.ts";
import { FieldMetadata } from "../../../vip-report-vcf/src/types/Metadata";

export const VariantContainer: Component<{
  metadata: MetadataContainer;
  variantType: VariantType;
  record: Item<Record>;
  sample: SampleContainer | null;
}> = (props) => {
  const samples = (): Item<Sample>[] =>
    props.sample
      ? [
          props.sample.item,
          props.sample.maternalSample,
          props.sample.paternalSample,
          ...props.sample.otherPedigreeSamples,
        ].filter((id) => id !== null)
      : [];

  const nestedTableConfigs = (): ConfigCells[] => {
    const fieldMap = createFieldMap(props.metadata.records);

    function createTableConfig(fieldMetadata: FieldMetadata) {
      return createConfigFields(
        [
          {
            type: "group",
            fields: fieldMetadata.nested!.items.map((childFieldMetadata) => {
              const name = `${fieldMetadata.id}/${childFieldMetadata.id}`;
              return name === "CSQ/VIPC"
                ? { type: "composed", name: "vipC" }
                : {
                    type: "info",
                    name: name,
                  };
            }),
          },
        ],
        fieldMap,
        props.sample,
        props.variantType,
      );
    }

    return Object.values(props.metadata.records.info)
      .filter((fieldMetadata) => fieldMetadata.nested && props.record.data.n[fieldMetadata.id] !== undefined)
      .map((fieldMetadata) => createTableConfig(fieldMetadata));
  };

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
      <For each={nestedTableConfigs()}>
        {(nestedTableConfig) => (
          <div class="columns">
            <div class="column is-full">
              <RecordsTable fieldConfigs={nestedTableConfig} records={[props.record]} verticalHeaders={true} />
            </div>
          </div>
        )}
      </For>
    </>
  );
};
