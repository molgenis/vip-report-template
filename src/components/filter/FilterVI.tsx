import { Component, For } from "solid-js";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterProps } from "./Filter";
import { selector, selectorKey } from "../../utils/query";
import { Item, Sample, Selector } from "@molgenis/vip-report-api/src/Api";

export type CheckboxGroup = {
  [key: string]: boolean;
};

export type CategoryDescriptions = {
  [key: string]: string;
};

const labels: CategoryDescriptions = {
  AR_C: "Autosomal Recessive: Compound Hetrozygote",
  AD_IP: "Autosomal Dominant: Incomplete Penentrance",
  AR: "Autosomal Recessive",
  AD: "Autosomal Dominant",
  XLD: "X-Linked Dominant",
  XLR: "X-Linked Recessive",
};

export const FilterVI: Component<FilterProps> = (props) => {
  const group: CheckboxGroup = {};
  if (props.query !== undefined) {
    (props.query?.args as string[]).forEach((key) => {
      group[key] = true;
    });
  }

  // enable null category for any_has_any case if someone asks for it (requires query to be composed)
  const fieldSelector: Selector = ["s", (props.sample as Item<Sample>).data.index, ...selector(props.field)];
  const onChange = (event: CheckboxEvent) => {
    group[event.value] = event.checked;
    const values = Object.keys(group).filter((key) => group[key]);
    if (values.length > 0) {
      props.onChange({
        key: selectorKey(fieldSelector),
        query: {
          selector: fieldSelector,
          operator: "has_any",
          args: values,
        },
      });
    } else {
      props.onClear({ key: selectorKey(fieldSelector) });
    }
  };

  return (
    <>
      <For each={props.field.categories}>
        {(category) => (
          <div class="control">
            <Checkbox
              value={category}
              label={category}
              desc={labels[category] !== undefined ? labels[category] : category}
              checked={props.query && (props.query.args as (string | null)[]).includes(category)}
              onChange={onChange}
            />
          </div>
        )}
      </For>
    </>
  );
};
