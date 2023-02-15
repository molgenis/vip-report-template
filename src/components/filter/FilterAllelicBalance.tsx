import { Component } from "solid-js";
import { ComposedQuery, Item, Query, Sample, Selector } from "@molgenis/vip-report-api/src/Api";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";
import { selector, selectorKey } from "../../utils/query";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export function getAllelicBalanceQuery(sampleIndex: number): ComposedQuery {
  const hetQuery: ComposedQuery = {
    operator: "and",
    args: [
      { selector: ["s", sampleIndex, "GT", "t"], operator: "==", args: "het" },
      {
        operator: "and",
        args: [
          { selector: ["s", sampleIndex, "VIAB"], operator: ">=", args: 0.2 },
          { selector: ["s", sampleIndex, "VIAB"], operator: "<=", args: 0.8 },
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
      {
        operator: "or",
        args: [
          { selector: ["s", sampleIndex, "VIAB"], operator: "<", args: 0.02 },
          { selector: ["s", sampleIndex, "VIAB"], operator: ">", args: 0.98 },
        ],
      },
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
  field: FieldMetadata;
  sample?: Item<Sample>;
  query?: Query;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    const fieldSelector: Selector = ["s", (props.sample as Item<Sample>).data.index, ...selector(props.field)];
    if (event.checked) {
      props.onChange({
        query: getAllelicBalanceQuery((props.sample?.data as Sample).index),
        key: selectorKey(fieldSelector),
      });
    } else props.onClear({ key: selectorKey(fieldSelector) });
  };
  return (
    <div class="control">
      <Checkbox
        desc="Filter variants with allelic imbalance; For hetrozygote calls: AB < 0.2 or AB > 0.8 and for homozygote calls: AB > 0.02 are considered allelic imbalance"
        label="No allelic imbalance"
        checked={props.query && props.query.args !== undefined}
        onChange={onFilterChange}
      />
    </div>
  );
};
