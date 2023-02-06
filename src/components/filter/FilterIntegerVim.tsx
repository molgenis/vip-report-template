import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";
import { Item, Sample, Selector } from "@molgenis/vip-report-api/src/Api";

export const FilterIntegerVim: Component<FilterProps> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    const fieldSelector: Selector = ["s", (props.sample as Item<Sample>).data.index, ...selector(props.field)];
    if (event.checked)
      props.onChange({
        key: selectorKey(fieldSelector),
        query: {
          operator: "or",
          args: [
            {
              selector: fieldSelector,
              operator: "==",
              args: 1,
            },
            {
              selector: fieldSelector,
              operator: "==",
              args: null,
            },
          ],
        },
      });
    else props.onClear({ key: selectorKey(fieldSelector) });
  };

  return (
    <div class="control">
      <Checkbox
        label="Inheritance: match"
        checked={props.query && props.query.args !== undefined}
        onChange={onFilterChange}
      />
    </div>
  );
};
