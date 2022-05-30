import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { InfoFilters, InfoFiltersChangeEvent } from "./InfoFilters";
import { FilterChangeEvent } from "./Filter";
import { SamplesFilters, SamplesFiltersChangeEvent } from "./SamplesFilters";
import { SampleFiltersChangeEvent } from "./SampleFilters";

export type Filters = {
  fields: FilterChangeEvent[];
  samplesFields: SampleFiltersChangeEvent[];
};

export type FiltersChangeEvent = {
  filters: Filters;
};

export const Filters: Component<{
  fields: FieldMetadata[];
  samplesFields: { sample: Sample; fields: FieldMetadata[] }[];
  onChange: (event: FiltersChangeEvent) => void;
}> = (props) => {
  const filters: Filters = { fields: [], samplesFields: [] }; // eslint-disable-line @typescript-eslint/no-unused-vars

  const onFiltersChange = () => props.onChange({ filters });

  const onInfoFiltersChange = (event: InfoFiltersChangeEvent) => {
    filters.fields = event.filters;
    onFiltersChange();
  };

  const onSamplesFiltersChange = (event: SamplesFiltersChangeEvent) => {
    filters.samplesFields = event.filters;
    onFiltersChange();
  };

  return (
    <>
      <InfoFilters fields={props.fields} onChange={onInfoFiltersChange} />
      <SamplesFilters samplesFields={props.samplesFields} onChange={onSamplesFiltersChange} />
    </>
  );
};
