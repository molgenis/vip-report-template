import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";
import { Item, Sample, Selector } from "@molgenis/vip-report-api/src/Api";

export const FilterIntegerVid: Component<FilterProps> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    const fieldSelector: Selector = ["s", (props.sample as Item<Sample>).data.index, ...selector(props.field)];
    if (event.checked)
      props.onChange({
        key: selectorKey(fieldSelector),
        query: {
          selector: fieldSelector,
          operator: "==",
          args: 1,
        },
      });
    else props.onClear({ key: selectorKey(fieldSelector) });
  };

  return (
    <div class="control">
      <Checkbox
        label="Inheritance: de novo"
        checked={props.query && props.query.args === 1}
        onChange={onFilterChange}
      />
    </div>
  );
};
