import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";

export const FilterIntegerDp: Component<FilterProps> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked)
      props.onChange({
        key: selectorKey(selector(props.field)),
        query: { selector: selector(props.field), operator: ">=", args: 10 },
      });
    else props.onClear({ key: selectorKey(selector(props.field)) });
  };

  return (
    <div class="control">
      <Checkbox
        desc="Sequencing depth >= 10"
        label="Depth >= 10"
        checked={props.query && props.query.args === 10}
        onChange={onFilterChange}
      />
    </div>
  );
};
