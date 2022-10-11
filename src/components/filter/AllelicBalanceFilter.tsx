import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { ComposedQuery, Item, Query, Sample } from "@molgenis/vip-report-api/src/Api";
import { FilterQueries } from "../../store";
import { Checkbox, CheckboxEvent } from "../Checkbox";

export type CustomFilterChangeEvent = { query: Query; key: string };
export type CustomFilterClearEvent = { key: string };

export const AllelicBalanceFilter: Component<{
  sample: Item<Sample>;
  gtField: FieldMetadata;
  adField: FieldMetadata;
  queries?: FilterQueries;
  onChange: (event: CustomFilterChangeEvent) => void;
  onClear: (event: CustomFilterClearEvent) => void;
}> = (props) => {
  const query: Query | undefined = props.queries ? props.queries["AlleleBalance"] : undefined;

  const hetQuery: ComposedQuery = {
    operator: "and",
    args: [
      { selector: ["s", props.sample.id, "GT", "t"], operator: "==", args: "het" },
      {
        operator: "and",
        args: [
          { selector: ["s", props.sample.id, "VIAB"], operator: ">=", args: 0.2 },
          { selector: ["s", props.sample.id, "VIAB"], operator: "<=", args: 0.8 },
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
          { selector: ["s", props.sample.id, "GT", "t"], operator: "==", args: "hom_a" },
          { selector: ["s", props.sample.id, "GT", "t"], operator: "==", args: "hom_r" },
        ],
      },
      { selector: ["s", props.sample.id, "VIAB"], operator: "<", args: 0.02 },
    ],
  };
  const otherGtQuery: ComposedQuery = {
    operator: "or",
    args: [
      { selector: ["s", props.sample.id, "GT", "t"], operator: "==", args: "miss" },
      { selector: ["s", props.sample.id, "GT", "t"], operator: "==", args: "part" },
    ],
  };
  const combinedQuery: ComposedQuery = { operator: "or", args: [hetQuery, homQuery, otherGtQuery] };

  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked) {
      props.onChange({ query: combinedQuery, key: "AlleleBalance" });
    } else props.onClear({ key: "AlleleBalance" });
  };
  return <Checkbox label="No allele imbalance" checked={query && query.args !== undefined} onChange={onFilterChange} />;
};
