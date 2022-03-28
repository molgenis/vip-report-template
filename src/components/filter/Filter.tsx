import { Component, For } from "solid-js";
import { FieldMetadata } from "../../api/vcf/MetadataParser";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";

export type CheckboxGroup = {
  [key: string]: boolean;
};
export const Filter: Component<{
  fieldMetadata: FieldMetadata;
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
      props.onChange({ fieldMetadata: props.fieldMetadata, value: values });
    } else {
      props.onClear({ fieldMetadata: props.fieldMetadata });
    }
  };

  return (
    <>
      <p class="has-text-weight-semibold">{props.fieldMetadata.id}</p>
      <div class="field">
        <For each={props.fieldMetadata.categories}>
          {(category) => (
            <div class="control">
              <Checkbox value={category} label={category} onChange={onChange} />
            </div>
          )}
        </For>
        {!props.fieldMetadata.required && <Checkbox value={nullValue} label="No value" onChange={onChange} />}
      </div>
    </>
  );
};
