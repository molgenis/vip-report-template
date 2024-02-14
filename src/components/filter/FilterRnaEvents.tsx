import { Component } from "solid-js";
import { FilterProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";
import { Item, Sample, Selector } from "@molgenis/vip-report-api/src/Api";


export const FilterMaeEvent: Component<FilterProps> = (props) => {
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
                operator: "<=",
                args: 0.05,
              },
            ],
          },
        });
      else props.onClear({ key: selectorKey(fieldSelector) });
    };
  
    return (
      <div class="control">
        <Checkbox
          desc="MAE pval <= 0.05"
          label="MAE pval <= 0.05"
          checked={props.query && props.query.args !== undefined}
          onChange={onFilterChange}
        />
      </div>
    );
};
export const FilterFraserEvent: Component<FilterProps> = (props) => {
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
                operator: "<=",
                args: 0.05,
              },
            ],
          },
        });
      else props.onClear({ key: selectorKey(fieldSelector) });
    };
  
    return (
      <div class="control">
        <Checkbox
          desc="FRASER pval <= 0.05"
          label="FRASER pval <= 0.05"
          checked={props.query && props.query.args !== undefined}
          onChange={onFilterChange}
        />
      </div>
    );
};
export const FilterOutriderEvent: Component<FilterProps> = (props) => {
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
                operator: "<=",
                args: 0.05,
              },
            ],
          },
        });
      else props.onClear({ key: selectorKey(fieldSelector) });
    };
  
    return (
      <div class="control">
        <Checkbox
          desc="OUTRIDER pval <= 0.05"
          label="OUTRIDER pval <= 0.05"
          checked={props.query && props.query.args !== undefined}
          onChange={onFilterChange}
        />
      </div>
    );
  };
  