import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector } from "../../utils/query";

export const FilterIntegerGq: Component<FilterProps> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked) props.onChange({ query: { selector: selector(props.field), operator: ">=", args: 20 } });
    else props.onClear({ selector: selector(props.field) });
  };

  return (
    <div class="control">
      <Checkbox
        desc="Genotype quality >= 20"
        label="GT quality >= 20"
        checked={props.query && props.query.args === 20}
        onChange={onFilterChange}
      />
    </div>
  );
};
