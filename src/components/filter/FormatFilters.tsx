import { Component, Show } from "solid-js";
import { FieldMetadataContainer } from "@molgenis/vip-report-vcf/src/VcfParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FormatBoolFilter } from "./FormatBoolFilter";
import { FormatQualityFilter } from "./FormatQualityFilter";
import { QueryOperator } from "@molgenis/vip-report-api/src/Api";

export type FormatFilterChangeEvent = {
  operator: QueryOperator;
  fieldMetadata: FieldMetadata;
  value: string | number | undefined;
};

export type FormatFilterClearEvent = {
  fieldMetadata: FieldMetadata;
};

export type FormatFiltersChangeEvent = {
  filters: FormatFilterChangeEvent[];
};

type Filters = {
  [key: string]: FormatFilterChangeEvent;
};

export const FormatFilters: Component<{
  fieldMetadataContainer: FieldMetadataContainer;
  sampleId: number;
  onChange: (event: FormatFiltersChangeEvent, sampleId: number) => void;
}> = (props) => {
  const filters: Filters = {};

  const onFilterChange = (event: FormatFilterChangeEvent) => {
    filters[event.fieldMetadata.id] = event;
    props.onChange({ filters: Object.values(filters) }, props.sampleId);
  };
  const onFilterClear = (event: FormatFilterClearEvent) => {
    delete filters[event.fieldMetadata.id];
    props.onChange({ filters: Object.values(filters) }, props.sampleId);
  };

  return (
    <>
      <Show
        when={
          !(
            props.fieldMetadataContainer["VIM"] === undefined ||
            props.fieldMetadataContainer["VID"] === undefined ||
            props.fieldMetadataContainer["VIC"] === undefined
          )
        }
      >
        <p class="has-text-weight-semibold">Inheritance filters</p>
        <>
          <FormatBoolFilter
            label="Inheritance match"
            desc="Only show variants where family genotypes match one or more of the genes inheritance modes."
            fieldMetadata={props.fieldMetadataContainer["VIM"]}
            sampleId={props.sampleId}
            onChange={onFilterChange}
            onClear={onFilterClear}
          />
          <FormatBoolFilter
            label="Denovo"
            desc="Only show denovo variants."
            fieldMetadata={props.fieldMetadataContainer["VID"]}
            sampleId={props.sampleId}
            onChange={onFilterChange}
            onClear={onFilterClear}
          />
        </>
      </Show>
      <Show when={props.fieldMetadataContainer["DP"] !== undefined}>
        <p class="has-text-weight-semibold">Quality filters</p>
        <>
          <FormatQualityFilter
            fieldMetadata={props.fieldMetadataContainer["DP"]}
            sampleId={props.sampleId}
            onChange={onFilterChange}
            onClear={onFilterClear}
          />
        </>
      </Show>
    </>
  );
};
