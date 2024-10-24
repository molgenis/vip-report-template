import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Component, For, Match, Show, Switch } from "solid-js";
import { CellValue, ConfigCellGroup, ConfigCellItem } from "../types/configCell";
import { ConfigCells } from "../types/config";
import { Abbr } from "./Abbr";
import { Field } from "./field/Field";

export const RecordsTable: Component<{
  fieldConfigs: ConfigCells;
  records: Item<Record>[];
  verticalHeaders?: boolean;
}> = (props) => {
  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <RecordsTableHeader fieldConfigs={props.fieldConfigs} verticalHeaders={props.verticalHeaders} />
          <RecordsTableBody fieldConfigs={props.fieldConfigs} records={props.records} />
        </table>
      </div>
    </div>
  );
};

const RecordsTableHeader: Component<{
  fieldConfigs: ConfigCells;
  verticalHeaders?: boolean;
}> = (props) => {
  return (
    <thead>
      <tr style={props.verticalHeaders ? { "writing-mode": "vertical-rl" } : undefined}>
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
      </tr>
    </thead>
  );
};

const RecordsTableHeaderCell: Component<{
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
  records: Item<Record>[];
}> = (props) => {
  return (
    <tbody>
      <For each={props.records}>
        {(record) => (
          <tr>
            <For each={props.fieldConfigs}>
              {(fieldConfig) => (
                <Switch fallback={<RecordsTableCell fieldConfig={fieldConfig as ConfigCellItem} record={record} />}>
                  <Match when={fieldConfig.type === "group"}>
                    <For each={(fieldConfig as ConfigCellGroup).fieldConfigs}>
                      {(childConfigField) => <RecordsTableCell fieldConfig={childConfigField} record={record} />}
                    </For>
                  </Match>
                </Switch>
              )}
            </For>
          </tr>
        )}
      </For>
    </tbody>
  );
};

const RecordsTableCell: Component<{
  fieldConfig: ConfigCellItem;
  record: Item<Record>;
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

const RecordsTableCellLine: Component<{
  fieldConfig: ConfigCellItem;
  record: Item<Record>;
  valueIndex: number;
}> = (props) => {
  const value = (): CellValue => props.fieldConfig.value(props.record, { valueIndex: props.valueIndex });

  return (
    <div>
      <Field config={props.fieldConfig} value={value()} />
      {/* print Unicode zero width space character to ensure a line with non-zero height */}
      <span>{"\u200b"}</span>
    </div>
  );
};
