import { Component, For, Show } from "solid-js";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Info } from "./record/Info";
import { Abbr } from "./Abbr";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";

export const ConsequenceTable: Component<{ csqMetadata: FieldMetadata[]; csqValues: ValueArray }> = (props) => {
  console.log(props.csqMetadata);

  function getValues(index: number) {
    const value: ValueArray =
      props.csqValues[index] !== null ? (props.csqValues[index] as ValueArray) : ([] as ValueArray);
    return value;
  }

  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <For each={props.csqMetadata}>
              {(metadata: FieldMetadata, index) => (
                <Show when={!(getValues(index()).length === 0)}>
                  <tr>
                    <th>
                      <Abbr
                        title={metadata.description !== undefined ? metadata.description : ""}
                        value={metadata.label !== undefined ? metadata.label : metadata.id}
                      ></Abbr>
                    </th>
                    <td>
                      <Info info={props.csqValues[index()]} infoMetadata={metadata}></Info>
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
