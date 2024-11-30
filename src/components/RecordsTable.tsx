import { VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { Component, For, Match, Show, Switch } from "solid-js";
import { CellValue, ConfigCellGroup, ConfigCellItem } from "../types/configCells";
import { ConfigCells } from "../types/config";
import { Abbr } from "./Abbr";
import { Field } from "./field/Field";
import { Table } from "./Table.tsx";

export const RecordsTable: Component<{
  fieldConfigs: ConfigCells;
  records: Item<VcfRecord>[];
  verticalHeaders?: boolean;
}> = (props) => {
  return (
    <Table>
      <RecordsTableHeader fieldConfigs={props.fieldConfigs} verticalHeaders={props.verticalHeaders} />
      <RecordsTableBody fieldConfigs={props.fieldConfigs} records={props.records} />
    </Table>
  );
};

const RecordsTableHeader: Component<{
  fieldConfigs: ConfigCells;
  verticalHeaders?: boolean;
}> = (props) => {
  return (
    <thead>
      <tr style={props.verticalHeaders ? { "writing-mode": "vertical-rl" } : undefined}>
        <RecordsTableHeaderCells fieldConfigs={props.fieldConfigs} />
      </tr>
    </thead>
  );
};

export const RecordsTableHeaderCells: Component<{ fieldConfigs: ConfigCells }> = (props) => {
  return (
    <For each={props.fieldConfigs}>
      {(fieldConfig) => (
        <Switch fallback={<RecordsTableHeaderCell fieldConfig={fieldConfig as ConfigCellItem} />}>
          <Match when={fieldConfig.type === "group"}>
            <For each={(fieldConfig as ConfigCellGroup).fieldConfigs}>
              {(childConfigField) => <RecordsTableHeaderCell fieldConfig={childConfigField} />}
            </For>
          </Match>
        </Switch>
      )}
    </For>
  );
};

export const RecordsTableHeaderCell: Component<{
  fieldConfig: ConfigCellItem;
}> = (props) => {
  const label = () => props.fieldConfig.label();
  const description = () => props.fieldConfig.description();

  return (
    <th>
      <Show when={description()} fallback={label()}>
        {(description) => <Abbr title={description()} value={label()} />}
      </Show>
    </th>
  );
};

const RecordsTableBody: Component<{
  fieldConfigs: ConfigCells;
  records: Item<VcfRecord>[];
}> = (props) => {
  return (
    <tbody>
      <For each={props.records}>
        {(record) => (
          <tr>
            <RecordsTableCells fieldConfigs={props.fieldConfigs} record={record} />
          </tr>
        )}
      </For>
    </tbody>
  );
};

export const RecordsTableCells: Component<{ fieldConfigs: ConfigCells; record: Item<VcfRecord> }> = (props) => {
  return (
    <For each={props.fieldConfigs}>
      {(fieldConfig) => (
        <Switch fallback={<RecordsTableCell fieldConfig={fieldConfig as ConfigCellItem} record={props.record} />}>
          <Match when={fieldConfig.type === "group"}>
            <For each={(fieldConfig as ConfigCellGroup).fieldConfigs}>
              {(childConfigField) => <RecordsTableCell fieldConfig={childConfigField} record={props.record} />}
            </For>
          </Match>
        </Switch>
      )}
    </For>
  );
};

export const RecordsTableCell: Component<{
  fieldConfig: ConfigCellItem;
  record: Item<VcfRecord>;
}> = (props) => {
  const lineIndices = () => [...Array(props.fieldConfig.valueCount(props.record))].map((_, i) => i);
  return (
    <td>
      <For each={lineIndices()}>
        {(valueIndex) => (
          <RecordsTableCellLine fieldConfig={props.fieldConfig} record={props.record} valueIndex={valueIndex} />
        )}
      </For>
    </td>
  );
};

export const RecordsTableCellLine: Component<{
  fieldConfig: ConfigCellItem;
  record: Item<VcfRecord>;
  valueIndex: number;
}> = (props) => {
  const value = (): CellValue => props.fieldConfig.value(props.record, props.valueIndex);

  return (
    <div>
      <Field config={props.fieldConfig} value={value()} />
      {/* print Unicode zero width space character to ensure a line with non-zero height */}
      <span>{"\u200b"}</span>
    </div>
  );
};
