import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";

export const FilterIntegerVim: Component<FilterProps> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked) {
      props.onChange({
        key: selectorKey(selector(props.field)),
        query: { selector: selector(props.field), operator: "==", args: 1 },
      });
    } else props.onClear({ key: selectorKey(selector(props.field)) });
  };

  return (
    <div class="control">
      <Checkbox label="Inheritance: match" checked={props.query && props.query.args === 1} onChange={onFilterChange} />
    </div>
  );
};
