import { Component, For, Show } from "solid-js";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { Table } from "./Table.tsx";
import { Item } from "@molgenis/vip-report-api";
import { RecordsTableCell, RecordsTableHeaderCell } from "./RecordsTable.tsx";
import { initConfigCells } from "../utils/config/configCells.ts";
import { MetadataContainer } from "../utils/api.ts";
import { VariantType } from "../utils/variantType.ts";
import { ConfigCellInfo } from "../types/configCells";

export const VariantInfoTable: Component<{
  variantType: VariantType;
  metadata: MetadataContainer;
  record: Item<VcfRecord>;
}> = (props) => {
  const configCells = () =>
    initConfigCells(
      [
        {
          type: "info",
          name: "((?!CSQ).)*",
        },
      ],
      props.variantType,
      props.metadata,
      null,
      "FIXME",
    ).filter((configCell) => configCell.type !== "group");

  return (
    <Table borderless={true}>
      <tbody>
        <For each={configCells()}>
          {(fieldConfig: ConfigCellInfo) => (
            <Show when={props.record.data.n[fieldConfig.field.id]}>
              <tr>
                <RecordsTableHeaderCell fieldConfig={fieldConfig} showParentHeader={true} />
                <RecordsTableCell fieldConfig={fieldConfig} record={props.record} />
              </tr>
            </Show>
          )}
        </For>
      </tbody>
    </Table>
  );
};
