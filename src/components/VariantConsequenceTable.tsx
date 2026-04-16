import { Component, For, Show } from "solid-js";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { Table } from "./Table.tsx";
import { initConfigCells } from "../utils/config/configCells.ts";
import { RecordsTableCellLine, RecordsTableHeaderCell } from "./RecordsTable.tsx";
import { VariantType } from "../utils/variantType.ts";
import { MetadataContainer } from "../utils/api.ts";
import { ConfigCellInfo } from "../types/configCells";

export const VariantConsequenceTable: Component<{
  variantType: VariantType;
  metadata: MetadataContainer;
  record: Item<VcfRecord>;
  consequenceId: number;
  isShowEmpty: boolean;
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

  function isEmptyValue(fieldConfig: ConfigCellInfo) {
    const value = fieldConfig.value(props.record, props.consequenceId);
    return value === null || value === undefined || (Array.isArray(value) && value.length === 0);
  }

  return (
    <Table borderless={true}>
      <tbody>
        <For each={configCells() as ConfigCellInfo[]}>
          {(fieldConfig: ConfigCellInfo) => (
            <Show when={!isEmptyValue(fieldConfig) || props.isShowEmpty}>
              <tr>
                <RecordsTableHeaderCell fieldConfig={fieldConfig} showParentHeader={true} />
                <td>
                  <RecordsTableCellLine
                    fieldConfig={fieldConfig}
                    record={props.record}
                    valueIndex={props.consequenceId}
                  />
                </td>
              </tr>
            </Show>
          )}
        </For>
      </tbody>
    </Table>
  );
};
