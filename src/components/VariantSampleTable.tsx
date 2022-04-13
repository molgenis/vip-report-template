import { Component, For } from "solid-js";
import { Record, RecordSample } from "../api/vcf/Vcf";
import { FieldMetadataContainer } from "../api/vcf/VcfParser";
import { FieldMetadata } from "../api/vcf/MetadataParser";
import { Format } from "./record/Format";
import { Sample } from "../api/Api";

export const VariantSampleTable: Component<{
  formatFields: FieldMetadataContainer;
  samples: Sample[];
  sampleValues: RecordSample[];
  record: Record;
}> = (props) => {
  const sampleFields: FieldMetadata[] = Object.keys(props.sampleValues[0]).map(
    (fieldId) => props.formatFields[fieldId]
  );

  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th></th>
              <For each={sampleFields}>{(formatField) => <th>{formatField.id}</th>}</For>
            </tr>
          </thead>
          <tbody>
            <For each={props.sampleValues}>
              {(sampleValue, i) => (
                <tr>
                  <th>{props.samples[i()].person.individualId}</th>
                  <For each={sampleFields}>
                    {(formatField) => (
                      <td>
                        <Format
                          format={sampleValue[formatField.id]}
                          formatMetadata={formatField}
                          record={props.record}
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
