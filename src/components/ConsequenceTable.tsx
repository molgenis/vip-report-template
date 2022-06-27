import { Component, For, Show } from "solid-js";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Info } from "./record/Info";
import { FieldHeader } from "./FieldHeader";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";

export const ConsequenceTable: Component<{
  csqMetadata: FieldMetadata[];
  csqValues: ValueArray;
  record: Item<Record>;
}> = (props) => {
  function getValues(index: number): ValueArray {
    return props.csqValues[index] !== null ? (props.csqValues[index] as ValueArray) : [];
  }

  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <For each={props.csqMetadata}>
              {(field: FieldMetadata, index) => (
                <Show when={!(getValues(index()).length === 0)}>
                  <tr>
                    <FieldHeader field={field} />
                    <td>
                      <Info
                        info={{ value: props.csqValues[index()], valueParent: props.csqValues, record: props.record }}
                        infoMeta={field}
                        context={{}}
                      />
                    </td>
                  </tr>
                </Show>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
