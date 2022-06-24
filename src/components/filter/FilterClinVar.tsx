import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { QueryClause } from "@molgenis/vip-report-api/src/Api";
import { FilterCategorical } from "./FilterCategorical";

export const FilterClinVar: Component<{
  field: FieldMetadata;
  query?: QueryClause;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  return (
    <FilterCategorical
      field={props.field}
      labels={{
        Benign: "B",
        Likely_benign: "LB",
        Uncertain_significance: "VUS",
        Likely_pathogenic: "LP",
        Pathogenic: "P",
        Conflicting_interpretations_of_pathogenicity: "Conflict",
      }}
      onChange={props.onChange}
      onClear={props.onClear}
    />
  );
};
