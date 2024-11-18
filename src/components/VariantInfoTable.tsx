import { Component, For } from "solid-js";
import { FieldMetadataContainer, InfoContainer } from "@molgenis/vip-report-vcf";
import { FieldInfo } from "./field/info/FieldInfo.tsx";
import { Table } from "./Table.tsx";

export const VariantInfoTable: Component<{
  infoMetadataContainer: FieldMetadataContainer;
  infoContainer: InfoContainer;
}> = (props) => {
  const fieldMetadatas = () =>
    Object.values(props.infoMetadataContainer).filter(
      (info) => !info.nested && props.infoContainer[info.id] !== undefined,
    );

  return (
    <Table>
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
    </Table>
  );
};
