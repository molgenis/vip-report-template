import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export type CheckboxGroup = {
  [key: string]: boolean;
};

function getDefaultValue(category: string, defaultValues: string[]) {
  return defaultValues !== undefined ? defaultValues.includes(category) : undefined;
}

export const FilterCategorical: Component<{
  field: FieldMetadata;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  defaultValues: Value | undefined;
}> = (props) => {
  if (props.defaultValues !== undefined && props.defaultValues !== null && !Array.isArray(props.defaultValues)) {
    throw new Error("Default value for a categorical filter should be an array.");
  }
  const group: CheckboxGroup = {};
  const nullValue = "__null";

  // enable null category for any_has_any case if someone asks for it (requires query to be composed)
  const includeNullCategory = () => !props.field.required && props.field.number.count === 1;

  const onChange = (event: CheckboxEvent) => {
    group[event.value !== undefined ? event.value : nullValue] = event.checked;
    const values = Object.keys(group)
      .filter((key) => group[key])
      .map((key) => (key !== nullValue ? key : null));
    if (values.length > 0) {
      props.onChange({
        query: {
          field: props.field,
          operator: props.field.number.count === 1 ? "has_any" : "any_has_any",
          value: values,
        },
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
            <Checkbox
              value={category}
              label={category}
              onChange={onChange}
              default={getDefaultValue(category, props.defaultValues as string[])}
            />
          </div>
        )}
      </For>
      {includeNullCategory() && <Checkbox value={nullValue} label="No value" onChange={onChange} />}
    </>
  );
};
