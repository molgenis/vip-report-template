import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";

export const FilterGene: Component<FilterProps> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    const fieldSelector = selector(props.field);
    if (event.checked) {
      props.onChange({
        key: selectorKey(fieldSelector),
        query: {
          selector: fieldSelector,
          operator: "any_has_any",
          args: ["1"],
        },
      });
    } else props.onClear({ key: selectorKey(fieldSelector) });
  };

  return (
    <>
      <p class="has-text-weight-semibold">{<span>Various</span>}</p>
      <div class="field">
        <Checkbox
          desc="Gene is associated with incomplete penetrance"
          label="Inc. Penetrance"
          checked={props.query && props.query.args !== undefined}
          onChange={onFilterChange}
        />
      </div>
    </>
  );
};
