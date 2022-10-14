import { Component, For } from "solid-js";
import { SampleFilters } from "./SampleFilters";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { FilterQueries } from "../../store";
import { AllelicBalanceFilter } from "./AllelicBalanceFilter";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";
import { SimpleFilterChangeEvent, SimpleFilterClearEvent } from "./Filter";
import { selectorKey } from "../../utils/query";

export type SampleFields = { sample: Item<Sample>; fields: FieldMetadata[] };

export const SamplesFilters: Component<{
  samplesFields: SampleFields[];
  queries?: FilterQueries;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const onChange = (event: SimpleFilterChangeEvent) => {
    {
      props.onChange({ key: selectorKey(event.query.selector), query: event.query });
    }
  };
  const onClear = (event: SimpleFilterClearEvent) => props.onClear({ key: selectorKey(event.selector) });
  return (
    <>
      <For each={props.samplesFields}>
        {(sampleField) => (
          <>
            <SampleFilters
              sample={sampleField.sample}
              fields={sampleField.fields}
              queries={props.queries}
              onChange={onChange}
              onClear={onClear}
            />
            <AllelicBalanceFilter sample={sampleField.sample} onChange={props.onChange} onClear={props.onClear} />
          </>
        )}
      </For>
    </>
  );
};
