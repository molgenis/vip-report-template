import { Component, For, Show } from "solid-js";
import { FieldMetadata, ValueArray, VcfRecord } from "@molgenis/vip-report-vcf";
import { FieldHeader } from "./FieldHeader";
import { Item } from "@molgenis/vip-report-api";
import { FieldTyped } from "./field/typed/FieldTyped.tsx";
import { Table } from "./Table.tsx";

export const VariantConsequenceTable: Component<{
  csqMetadata: FieldMetadata[];
  csqValues: ValueArray;
  record: Item<VcfRecord>;
}> = (props) => {
  function getValues(index: number): ValueArray {
    return props.csqValues[index] !== null ? (props.csqValues[index] as ValueArray) : [];
  }

  return (
    <Table borderless={true}>
      <tbody>
        <For each={props.csqMetadata}>
          {(field: FieldMetadata, index) => (
            <Show when={!(getValues(index()).length === 0)}>
              <tr>
                <FieldHeader field={field} />
                <td>
                  <FieldTyped metadata={field} value={props.csqValues[index()]} />
                </td>
              </tr>
            </Show>
          )}
        </For>
      </tbody>
    </Table>
  );
};
