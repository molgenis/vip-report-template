import { Component, For } from "solid-js";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterProps } from "./Filter";
import { selector, selectorKey } from "../../utils/query";

export type CheckboxGroup = {
  [key: string]: boolean;
};

export type CategoryLabels = {
  [key: string]: string;
};

export const FilterCategorical: Component<
  FilterProps & {
    labels?: CategoryLabels;
  }
> = (props) => {
  const group: CheckboxGroup = {};
  const label = () => (props.field.label !== undefined ? props.field.label : props.field.id);
  if (props.query !== undefined) {
    (props.query?.args as string[]).forEach((key) => {
      group[key] = true;
    });
  }

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
        key: selectorKey(selector(props.field)),
        query: {
          selector: selector(props.field),
          operator: props.field.number.count === 1 ? "has_any" : "any_has_any",
          args: values,
        },
      });
    } else {
      props.onClear({ key: selectorKey(selector(props.field)) });
    }
  };

  return (
    <>
      <p class="has-text-weight-semibold">
        {props.field.description ? <abbr title={props.field.description}>{label()}</abbr> : <span>{label()}</span>}
      </p>

      <div class="field">
        <For each={props.field.categories}>
          {(category) => (
            <div class="control">
              <Checkbox
                value={category}
                label={props.labels ? props.labels[category] : category}
                checked={props.query && (props.query.args as (string | null)[]).includes(category)}
                onChange={onChange}
              />
            </div>
          )}
        </For>
        {includeNullCategory() && (
          <Checkbox
            value={nullValue}
            label="No value"
            checked={props.query && (props.query.args as (string | null)[]).includes(null)}
            onChange={onChange}
          />
        )}
      </div>
    </>
  );
};
