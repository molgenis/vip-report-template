import { Component, For } from "solid-js";
import { FieldMetadataContainer } from "@molgenis/vip-report-vcf/src/VcfParser";
import { Info } from "./record/Info";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";

export const VariantInfoTable: Component<{
  infoFields: FieldMetadataContainer;
  record: Item<Record>;
}> = (props) => {
  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <For
              each={Object.values(props.infoFields).filter(
                (info) => !info.nested && props.record.data.n[info.id] !== undefined,
              )}
            >
              {(infoField) => (
                <tr>
                  <td>{infoField.id}</td>
                  <td>
                    <Info
                      info={{ value: props.record.data.n[infoField.id], record: props.record }}
                      infoMeta={infoField}
                      context={{}}
                    />
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
