import { Component, For, Show } from "solid-js";
import { Value, ValueString } from "../api/vcf/ValueParser";
import { FieldMetadata } from "../api/vcf/MetadataParser";

export const ConsequenceTable: Component<{ csqHeader: FieldMetadata; csq: Value[] }> = (props) => {
  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <For each={props.csqHeader}>
              {(value, index) => (
                <Show when={props.csq[index()] != null && props.csq[index()].length != 0}>
                  <tr>
                    <th>{value.id}</th>
                    <td>{props.csq[index()]}</td>
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
