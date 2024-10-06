import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Component, For, Match, Show, Switch } from "solid-js";
import { ConfigFieldFormat, ConfigFieldGroup, ConfigFieldInfo, ConfigFieldItem } from "../types/field";
import { FieldCustom } from "./record/field/custom/FieldCustom";
import { ConfigFieldCustom } from "../types/fieldCustom";
import { ConfigFields } from "../types/config";
import { Value, ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { RecordSampleType } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { Field } from "./record/field/Field";

export const RecordsTable: Component<{
  fieldConfigs: ConfigFields;
  records: Item<Record>[];
}> = (props) => {
  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <RecordsTableHeader fieldConfigs={props.fieldConfigs} />
          <RecordsTableBody fieldConfigs={props.fieldConfigs} records={props.records} />
        </table>
      </div>
    </div>
  );
};

const RecordsTableHeader: Component<{
  fieldConfigs: ConfigFields;
}> = (props) => {
  return (
    <thead>
      <tr>
        <For each={props.fieldConfigs}>
          {(fieldConfig) => (
            <Switch>
              <Match when={fieldConfig.type === "group"}>
                <For each={(fieldConfig as ConfigFieldGroup).fieldConfigs}>
                  {(childConfigField) => <RecordsTableHeaderCell fieldConfig={childConfigField} />}
                </For>
              </Match>
              <Match when={fieldConfig.type !== "group"}>
                <RecordsTableHeaderCell fieldConfig={fieldConfig as ConfigFieldItem} />
              </Match>
            </Switch>
          )}
        </For>
      </tr>
    </thead>
  );
};

const RecordsTableHeaderCell: Component<{
  fieldConfig: ConfigFieldItem;
}> = (props) => {
  // FIXME abbreviations etc.
  return (
    <th>
      <Switch>
        <Match when={props.fieldConfig.type === "custom"}>{(props.fieldConfig as ConfigFieldCustom).label}</Match>
        <Match when={props.fieldConfig.type === "format"}>
          {(props.fieldConfig as ConfigFieldFormat).field.label || (props.fieldConfig as ConfigFieldFormat).field.id}
        </Match>
        <Match when={props.fieldConfig.type === "info"}>
          {(props.fieldConfig as ConfigFieldInfo).field.label || (props.fieldConfig as ConfigFieldInfo).field.id}
        </Match>
      </Switch>
    </th>
  );
};

const RecordsTableBody: Component<{
  fieldConfigs: ConfigFields;
  records: Item<Record>[];
}> = (props) => {
  return (
    <tbody>
      <For each={props.records}>
        {(record) => (
          <tr>
            <For each={props.fieldConfigs}>
              {(fieldConfig) => (
                <Switch>
                  <Match when={fieldConfig.type === "group"}>
                    <For each={(fieldConfig as ConfigFieldGroup).fieldConfigs}>
                      {(childConfigField) => <RecordsTableCell fieldConfig={childConfigField} record={record} />}
                    </For>
                  </Match>
                  <Match when={fieldConfig.type !== "group"}>
                    <RecordsTableCell fieldConfig={fieldConfig as ConfigFieldItem} record={record} />
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
  fieldConfig: ConfigFieldItem;
  record: Item<Record>;
}> = (props) => {
  return (
    <td>
      <Switch>
        <Match when={props.fieldConfig.type === "custom"}>
          <RecordsTableCellDataCustom fieldConfig={props.fieldConfig as ConfigFieldCustom} record={props.record} />
        </Match>
        <Match when={props.fieldConfig.type === "format"}>
          <RecordsTableCellDataFormat fieldConfig={props.fieldConfig as ConfigFieldFormat} record={props.record} />
        </Match>
        <Match when={props.fieldConfig.type === "info"}>
          <RecordsTableCellDataInfo fieldConfig={props.fieldConfig as ConfigFieldInfo} record={props.record} />
        </Match>
      </Switch>
    </td>
  );
};

const RecordsTableCellDataCustom: Component<{
  fieldConfig: ConfigFieldCustom;
  record: Item<Record>;
}> = (props) => {
  return <FieldCustom fieldConfig={props.fieldConfig} record={props.record} />;
};

const RecordsTableCellDataFormat: Component<{
  fieldConfig: ConfigFieldFormat;
  record: Item<Record>;
}> = (props) => {
  const isMultilineValue = () => props.fieldConfig.field.parent?.number.count !== 1;

  const value = () => {
    const recordSample = props.record.data.s[props.fieldConfig.sample.item.data.index];
    const parentField = props.fieldConfig.field.parent;

    let value: RecordSampleType;
    if (parentField) {
      const parentValue = recordSample[parentField.id] as ValueArray;
      const parentValueIndex = props.fieldConfig.parentFieldValueIndex as number; // FIXME remove cast
      if (isMultilineValue()) {
        value = parentValue.map((value) => (value as ValueArray)[parentValueIndex]) as ValueArray;
      } else {
        value = parentValue[parentValueIndex];
      }
    } else {
      value = recordSample[props.fieldConfig.id];
    }

    return value;
  };

  return (
    <Show
      when={isMultilineValue()}
      fallback={
        <Field
          infoMeta={props.fieldConfig.field}
          info={{ value: value() as Value, record: props.record }}
          context={{}}
        />
      }
    >
      {/* // FIXME remove cast to value in Show above */}
      <For each={value() as ValueArray}>
        {(aValue) => (
          <div>
            <Field infoMeta={props.fieldConfig.field} info={{ value: aValue, record: props.record }} context={{}} />
          </div>
        )}
      </For>
    </Show>
  );
};

const RecordsTableCellDataInfo: Component<{
  fieldConfig: ConfigFieldInfo;
  record: Item<Record>;
}> = (props) => {
  const isMultilineValue = () => props.fieldConfig.field.parent?.number.count !== 1;

  const value = () => {
    const infoContainer = props.record.data.n;
    const parentField = props.fieldConfig.field.parent;

    let value: Value;
    if (parentField) {
      const parentValue = infoContainer[parentField.id] as ValueArray;
      const parentValueIndex = props.fieldConfig.parentFieldValueIndex as number; // FIXME remove cast
      if (isMultilineValue()) {
        value = parentValue.map((value) => (value as ValueArray)[parentValueIndex]) as ValueArray;
      } else {
        value = parentValue[parentValueIndex];
      }
    } else {
      value = infoContainer[props.fieldConfig.id];
    }

    return value;
  };

  return (
    <Show
      when={isMultilineValue()}
      fallback={
        <Field infoMeta={props.fieldConfig.field} info={{ value: value(), record: props.record }} context={{}} />
      }
    >
      <For each={value() as ValueArray}>
        {(aValue) => (
          <div>
            <Field infoMeta={props.fieldConfig.field} info={{ value: aValue, record: props.record }} context={{}} />
          </div>
        )}
      </For>
    </Show>
  );
};
