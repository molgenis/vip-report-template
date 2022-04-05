import { Component, For } from "solid-js";
import { FieldMetadataContainer, InfoContainer } from "../api/vcf/VcfParser";

export const VariantInfoTable: Component<{ infoValues: InfoContainer; infoFields: FieldMetadataContainer }> = (
  props
) => {
  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <For
              each={Object.values(props.infoFields).filter(
                (info) => !info.nested && props.infoValues[info.id] !== undefined
              )}
            >
              {(infoField) => (
                <tr>
                  <td>{infoField.id}</td>
                  <td>{props.infoValues[infoField.id] as string}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};