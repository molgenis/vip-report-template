import { Component } from "solid-js";
import { ComposedQuery, Item, Query, Sample } from "@molgenis/vip-report-api/src/Api";
import { FilterQueries } from "../../store";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";

export function getAllelicBalanceQuery(sampleIndex: number): ComposedQuery {
  const hetQuery: ComposedQuery = {
    operator: "and",
    args: [
      { selector: ["s", sampleIndex, "GT", "t"], operator: "==", args: "het" },
      {
        operator: "and",
        args: [
          { selector: ["s", sampleIndex, "VIAB"], operator: ">", args: 0.2 },
          { selector: ["s", sampleIndex, "VIAB"], operator: "<", args: 0.8 },
        ],
      },
    ],
  };
  const homQuery: ComposedQuery = {
    operator: "and",
    args: [
      {
        operator: "or",
        args: [
          { selector: ["s", sampleIndex, "GT", "t"], operator: "==", args: "hom_a" },
          { selector: ["s", sampleIndex, "GT", "t"], operator: "==", args: "hom_r" },
        ],
      },
      { selector: ["s", sampleIndex, "VIAB"], operator: "<", args: 0.02 },
    ],
  };
  const otherGtQuery: ComposedQuery = {
    operator: "or",
    args: [
      { selector: ["s", sampleIndex, "GT", "t"], operator: "==", args: "miss" },
      { selector: ["s", sampleIndex, "GT", "t"], operator: "==", args: "part" },
      { selector: ["s", sampleIndex, "VIAB"], operator: "==", args: null },
      { selector: ["s", sampleIndex, "VIAB"], operator: "==", args: undefined },
    ],
  };
  const combinedQuery: ComposedQuery = { operator: "or", args: [hetQuery, homQuery, otherGtQuery] };

  return combinedQuery;
}

export const FilterAllelicBalance: Component<{
  sample: Item<Sample>;
  queries?: FilterQueries;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const query: Query | undefined = props.queries ? props.queries["AllelicBalance"] : undefined;

  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked) {
      props.onChange({ query: getAllelicBalanceQuery(props.sample.data.index), key: "AllelicBalance" });
    } else props.onClear({ key: "AllelicBalance" });
  };
  return (
    <div class="control">
      <Checkbox
        desc="Filter variants with allelic imbalance; For hetrozygote calls: AB < 0.2 or AB > 0.8 and for homozygote calls: AB > 0.02 are consided allelic imbalance"
        label="No allelic imbalance"
        checked={query && query.args !== undefined}
        onChange={onFilterChange}
      />
    </div>
  );
};
