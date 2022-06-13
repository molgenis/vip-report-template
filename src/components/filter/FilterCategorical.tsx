import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { selector } from "../../utils/query";
import { QueryClause } from "@molgenis/vip-report-api/src/Api";

export type CheckboxGroup = {
  [key: string]: boolean;
};

export const FilterCategorical: Component<{
  field: FieldMetadata;
  query?: QueryClause;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
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
          selector: selector(props.field),
          operator: props.field.number.count === 1 ? "has_any" : "any_has_any",
          args: values,
        },
      });
    } else {
      props.onClear({ selector: selector(props.field) });
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
              checked={props.query && (props.query.args as string[]).includes(category)}
              onChange={onChange}
            />
          </div>
        )}
      </For>
      {includeNullCategory() && (
        <Checkbox
          value={nullValue}
          label="No value"
          checked={props.query && (props.query.args as string[]).includes(nullValue)}
          onChange={onChange}
        />
      )}
    </>
  );
};
