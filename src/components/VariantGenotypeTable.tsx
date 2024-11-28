import { Component, For, Show } from "solid-js";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { getSampleLabel } from "../utils/sample.ts";
import { Item, Sample } from "@molgenis/vip-report-api";
import { Table } from "./Table.tsx";
import { MetadataContainer } from "../utils/api.ts";
import { VariantType } from "../utils/variantType.ts";
import { ConfigSamplesCells } from "../types/config";
import { RecordsTableCells, RecordsTableHeaderCells } from "./RecordsTable.tsx";

export const VariantGenotypeTable: Component<{
  config: ConfigSamplesCells;
  samples: Item<Sample>[];
  metadata: MetadataContainer;
  variantType: VariantType;
  record: Item<VcfRecord>;
}> = (props) => {
  return (
    <Show when={props.samples.length >= 0}>
      <Table>
        <thead>
          <tr>
            <th />
            <RecordsTableHeaderCells fieldConfigs={props.config[props.samples[0]!.id]!} />
          </tr>
        </thead>
        <tbody>
          <For each={props.samples}>
            {(sample) => (
              <Show when={props.config[sample.id]}>
                {(config) => (
                  <tr>
                    <th>{getSampleLabel(sample)}</th>
                    <RecordsTableCells fieldConfigs={config()} record={props.record} />
                  </tr>
                )}
              </Show>
            )}
          </For>
        </tbody>
      </Table>
    </Show>
  );
};
