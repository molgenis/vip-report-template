import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";
import { Item, Sample, Selector } from "@molgenis/vip-report-api/src/Api";

export const FilterIntegerDp: Component<FilterProps> = (props) => {
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
              operator: ">=",
              args: 20,
            },
            {
              selector: fieldSelector,
              operator: "==",
              args: null,
            },
            {
              selector: fieldSelector,
              operator: "==",
              args: undefined,
            },
          ],
        },
      });
    else props.onClear({ key: selectorKey(fieldSelector) });
  };

  return (
    <div class="control">
      <Checkbox
        desc="Sequencing depth >= 20"
        label="Depth >= 20"
        checked={props.query && props.query.args !== undefined}
        onChange={onFilterChange}
      />
    </div>
  );
};
