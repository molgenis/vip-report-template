import { Component, For } from "solid-js";
import { FieldMetadataContainer } from "@molgenis/vip-report-vcf/src/VcfParser";
import { FieldHeader } from "./FieldHeader";
import { RecordSample } from "../../../vip-report-vcf/src/SampleDataParser.ts";
import { FieldGenotype } from "./field/genotype/FieldGenotype.tsx";
import { getSampleLabel } from "../utils/sample.ts";
import { Item, Sample } from "../../../vip-report-api/src/Api";

export const VariantGenotypeTable: Component<{
  samples: Item<Sample>[];
  formatMetadataContainer: FieldMetadataContainer;
  recordSamples: RecordSample[];
}> = (props) => {
  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
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
                        <FieldGenotype
                          metadata={formatField}
                          value={props.recordSamples[sample.id]![formatField.id]!}
                        />
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
