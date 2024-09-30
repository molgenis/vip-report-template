import { Component, For } from "solid-js";
import { FieldMetadataContainer, InfoContainer } from "@molgenis/vip-report-vcf";
import { FieldInfo } from "./field/info/FieldInfo.tsx";

export const VariantInfoTable: Component<{
  infoMetadataContainer: FieldMetadataContainer;
  infoContainer: InfoContainer;
}> = (props) => {
  const fieldMetadatas = () =>
    Object.values(props.infoMetadataContainer).filter(
      (info) => !info.nested && props.infoContainer[info.id] !== undefined,
    );

  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <For each={fieldMetadatas()}>
              {(fieldMetadata) => (
                <tr>
                  <td>{fieldMetadata.id}</td>
                  <td>
                    <FieldInfo metadata={fieldMetadata} value={props.infoContainer[fieldMetadata.id]} />
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
