import { Component, createMemo, For, Show } from "solid-js";
import { FieldMetadata, ValueArray, VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { FieldTyped } from "./field/typed/FieldTyped.tsx";
import { Table } from "./Table.tsx";
import { abbreviateHeader } from "../utils/utils.ts";

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

const FieldHeader: Component<{
  field: FieldMetadata;
  vertical?: boolean;
  rowspan?: number;
  colspan?: number;
}> = (props) => {
  const label = createMemo(() => abbreviateHeader(props.field.label || props.field.id));
  return (
    <th
      style={props.vertical ? { "writing-mode": "vertical-rl" } : undefined}
      rowspan={props.rowspan}
      colspan={props.colspan}
    >
      <Show
        when={props.field.description && props.field.description !== label()}
        fallback={<abbr title={props.field.label || props.field.id}>{label()}</abbr>}
      >
        <abbr title={props.field.description}>{label()}</abbr>
      </Show>
    </th>
  );
};
