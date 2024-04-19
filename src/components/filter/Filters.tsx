import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, Query, Sample } from "@molgenis/vip-report-api/src/Api";
import { InfoFilters } from "./InfoFilters";
import { SamplesFilters } from "./SamplesFilters";
import { FilterQueries } from "../../store";

export type FilterChangeEvent = { key: string; query: Query };
export type FilterClearEvent = { key: string };

export const Filters: Component<{
  fields: FieldMetadata[];
  samplesFields: { sample: Item<Sample>; fields: FieldMetadata[] }[];
  queries?: FilterQueries;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  console.log(props);
  return (
    <>
      <InfoFilters fields={props.fields} queries={props.queries} onChange={props.onChange} onClear={props.onClear} />
      <SamplesFilters
        samplesFields={props.samplesFields}
        queries={props.queries}
        onChange={props.onChange}
        onClear={props.onClear}
      />
    </>
  );
};
