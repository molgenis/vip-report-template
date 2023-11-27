import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";

export const FilterIP: Component<FilterProps> = (props) => {
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
    <div class="control">
      <Checkbox
        desc="Gene is associated with incomplete penetrance"
        label="True"
        checked={props.query && props.query.args !== undefined}
        onChange={onFilterChange}
      />
    </div>
  );
};
