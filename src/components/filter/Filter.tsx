import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";

export type CheckboxGroup = {
  [key: string]: boolean;
};
export const Filter: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const group: CheckboxGroup = {};
  const nullValue = "__null";

  const label = () => (props.field.label !== undefined ? props.field.label : props.field.id);
  const onChange = (event: CheckboxEvent) => {
    group[event.value !== undefined ? event.value : nullValue] = event.checked;
    const values = Object.keys(group)
      .filter((key) => group[key])
      .map((key) => (key !== nullValue ? key : null));
    if (values.length > 0) {
      props.onChange({ field: props.field, value: values });
    } else {
      props.onClear({ field: props.field });
    }
  };

  return (
    <>
      <p class="has-text-weight-semibold">{label()}</p>
      <div class="field">
        <For each={props.field.categories}>
          {(category) => (
            <div class="control">
              <Checkbox value={category} label={category} onChange={onChange} />
            </div>
          )}
        </For>
        {!props.field.required && <Checkbox value={nullValue} label="No value" onChange={onChange} />}
      </div>
    </>
  );
};
