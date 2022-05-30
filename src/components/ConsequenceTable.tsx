import { Component, For, Show } from "solid-js";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Info } from "./record/Info";

export const ConsequenceTable: Component<{ csqMetadata: FieldMetadata[]; csqValues: ValueArray }> = (props) => {
  function getValues(index: number): ValueArray {
    return props.csqValues[index] !== null ? (props.csqValues[index] as ValueArray) : [];
  }

  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <For each={props.csqMetadata}>
              {(field: FieldMetadata, index) => (
                <Show when={!(getValues(index()).length === 0)}>
                  <tr>
                    <th>
                      <Show when={field.description} fallback={<span>{field.label || field.id}</span>}>
                        <abbr title={field.description}>{field.label || field.id}</abbr>
                      </Show>
                    </th>
                    <td>
                      <Info info={props.csqValues[index()]} infoMetadata={field}></Info>
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
