import { Component, createMemo, For } from "solid-js";
import { Record, RecordSample } from "@molgenis/vip-report-vcf/src/Vcf";
import { FieldMetadataContainer } from "@molgenis/vip-report-vcf/src/VcfParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Format } from "./record/Format";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { FieldHeader } from "./FieldHeader";

export const VariantSampleTable: Component<{
  formatFields: FieldMetadataContainer;
  samples: Sample[];
  sampleValues: RecordSample[];
  record: Record;
}> = (props) => {
  const sampleFields = createMemo((): FieldMetadata[] =>
    Object.keys(props.sampleValues[0]).map((fieldId) => props.formatFields[fieldId])
  );
  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th />
              <For each={sampleFields()}>{(formatField) => <FieldHeader field={formatField} />}</For>
            </tr>
          </thead>
          <tbody>
            <For each={props.sampleValues}>
              {(sampleValue, i) => (
                <tr>
                  <th>{props.samples[i()].person.individualId}</th>
                  <For each={sampleFields()}>
                    {(formatField) => (
                      <td>
                        <Format
                          format={sampleValue[formatField.id]}
                          formatMetadata={formatField}
                          record={props.record}
                          isAbbreviate={false}
                          allelicDepth={props.record.s[props.samples[i()].index]["AD"] as number[]}
                          readDepth={props.record.s[props.samples[i()].index]["DP"] as number}
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
