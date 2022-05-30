import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";

export type CheckboxGroup = {
  [key: string]: boolean;
};

export const FilterCategorical: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const group: CheckboxGroup = {};
  const nullValue = "__null";

  const onChange = (event: CheckboxEvent) => {
    group[event.value !== undefined ? event.value : nullValue] = event.checked;
    const values = Object.keys(group)
      .filter((key) => group[key])
      .map((key) => (key !== nullValue ? key : null));
    if (values.length > 0) {
      props.onChange({
        field: props.field,
        operator: props.field.number.count === 1 ? "has_any" : "any_has_any",
        value: values,
      });
    } else {
      props.onClear({ field: props.field });
    }
  };

  return (
    <>
      <For each={props.field.categories}>
        {(category) => (
          <div class="control">
            <Checkbox value={category} label={category} onChange={onChange} />
          </div>
        )}
      </For>
      {!props.field.required && <Checkbox value={nullValue} label="No value" onChange={onChange} />}
    </>
  );
};
