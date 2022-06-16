import { Component, For } from "solid-js";
import { FieldMetadataContainer, InfoContainer } from "@molgenis/vip-report-vcf/src/VcfParser";
import { Info } from "./record/Info";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";

export const VariantInfoTable: Component<{
  infoFields: FieldMetadataContainer;
  record: Record;
}> = (props) => {
  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <For
              each={Object.values(props.infoFields).filter(
                (info) => !info.nested && props.record.n[info.id] !== undefined
              )}
            >
              {(infoField) => (
                <tr>
                  <td>{infoField.id}</td>
                  <td>
                    <Info variant={props.record} info={props.record.n[infoField.id]} infoMetadata={infoField}></Info>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
