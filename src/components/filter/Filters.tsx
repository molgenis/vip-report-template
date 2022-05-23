import { Component, For } from "solid-js";
import { FieldMetadataContainer } from "@molgenis/vip-report-vcf/src/VcfParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Filter } from "./Filter";
import { flattenFieldMetadata } from "../../utils/field";
import { PhenotypeFilter } from "./PhenotypeFilter";

export type FilterChangeEvent = {
  fieldMetadata: FieldMetadata;
  value: (string | null)[];
};

export type FilterClearEvent = {
  fieldMetadata: FieldMetadata;
};

export type FiltersChangeEvent = {
  filters: FilterChangeEvent[];
};

type Filters = {
  [key: string]: FilterChangeEvent;
};

export const Filters: Component<{
  fieldMetadataContainer: FieldMetadataContainer;
  onChange: (event: FiltersChangeEvent) => void;
  fields: { [key: string]: string };
  sampleId: string | undefined;
}> = (props) => {
  const fieldIds = () => Object.keys(props.fields);
  const infoMetadataItems = () =>
    flattenFieldMetadata(props.fieldMetadataContainer)
      .filter((fieldMetadata) => fieldMetadata.type === "CATEGORICAL" || fieldMetadata.id === "HPO")
      .filter(
        (fieldMetadata) => fieldIds().length == 0 || fieldIds().includes(fieldMetadata.id) || fieldMetadata.id === "HPO"
      );
  const filters: Filters = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

  const onFilterChange = (event: FilterChangeEvent) => {
    filters[event.fieldMetadata.id] = event;
    props.onChange({ filters: Object.values(filters) });
  };
  const onFilterClear = (event: FilterClearEvent) => {
    delete filters[event.fieldMetadata.id];
    props.onChange({ filters: Object.values(filters) });
  };

  return (
    <>
      <For each={infoMetadataItems()}>
        {(infoMetadata) => (
          <>
            {infoMetadata.id !== "HPO" && (
              <Filter
                label={props.fields[infoMetadata.id]}
                fieldMetadata={infoMetadata}
                onChange={onFilterChange}
                onClear={onFilterClear}
              />
            )}
            {infoMetadata.id === "HPO" && props.sampleId !== undefined && (
              <PhenotypeFilter
                sampleId={props.sampleId}
                fieldMetadata={infoMetadata}
                onChange={onFilterChange}
                onClear={onFilterClear}
              />
            )}
          </>
        )}
      </For>
    </>
  );
};
