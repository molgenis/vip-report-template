import { Component, For } from "solid-js";
import { FieldMetadataContainer, RecordSample } from "@molgenis/vip-report-vcf";
import { FieldHeader } from "./FieldHeader";
import { FieldGenotype } from "./field/genotype/FieldGenotype.tsx";
import { getSampleLabel } from "../utils/sample.ts";
import { Item, Sample } from "@molgenis/vip-report-api";
import { Table } from "./Table.tsx";

export const VariantGenotypeTable: Component<{
  samples: Item<Sample>[];
  formatMetadataContainer: FieldMetadataContainer;
  recordSamples: RecordSample[];
}> = (props) => {
  return (
    <Table>
      <thead>
        <tr>
          <th />
          <For each={Object.values(props.formatMetadataContainer)}>
            {(formatField) => <FieldHeader field={formatField} />}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={props.samples}>
          {(sample) => (
            <tr>
              <th>{getSampleLabel(sample)}</th>
              <For each={Object.values(props.formatMetadataContainer)}>
                {(formatField) => (
                  <td>
                    <FieldGenotype metadata={formatField} value={props.recordSamples[sample.id]![formatField.id]!} />
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </Table>
  );
};
