import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filter";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector } from "../../utils/query";
import { QueryClause } from "@molgenis/vip-report-api/src/Api";

export const FilterIntegerDp: Component<{
  field: FieldMetadata;
  query?: QueryClause;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const onFilterChange = (event: CheckboxEvent) => {
    if (event.checked) props.onChange({ query: { selector: selector(props.field), operator: ">=", args: 20 } });
    else props.onClear({ selector: selector(props.field) });
  };

  return (
    <div class="control">
      <Checkbox label="Read depth >= 20" checked={props.query && props.query.args === true} onChange={onFilterChange} />
    </div>
  );
};
