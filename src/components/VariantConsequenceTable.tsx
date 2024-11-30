import { Component, For } from "solid-js";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { Table } from "./Table.tsx";
import { initConfigCells } from "../utils/config/configCells.ts";
import { RecordsTableCellLine, RecordsTableHeaderCell } from "./RecordsTable.tsx";
import { VariantType } from "../utils/variantType.ts";
import { MetadataContainer } from "../utils/api.ts";

export const VariantConsequenceTable: Component<{
  variantType: VariantType;
  metadata: MetadataContainer;
  record: Item<VcfRecord>;
  consequenceId: number;
}> = (props) => {
  const configCells = () =>
    initConfigCells(
      [
        {
          type: "info",
          name: "CSQ/.*",
        },
      ],
      props.variantType,
      props.metadata,
      null,
    ).filter((configCell) => configCell.type !== "group");

  return (
    <Table borderless={true}>
      <tbody>
        <For each={configCells()}>
          {(fieldConfig) => (
            <tr>
              <RecordsTableHeaderCell fieldConfig={fieldConfig} />
              <td>
                <RecordsTableCellLine
                  fieldConfig={fieldConfig}
                  record={props.record}
                  valueIndex={props.consequenceId}
                />
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </Table>
  );
};
