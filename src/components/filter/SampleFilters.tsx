import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, Sample, SelectorPart } from "@molgenis/vip-report-api/src/Api";
import { Filter, SimpleFilterChangeEvent, SimpleFilterClearEvent } from "./Filter";
import { FilterQueries } from "../../store";
import { sampleFieldKey } from "../../utils/query";

export const SampleFilters: Component<{
  sample: Item<Sample>;
  fields: FieldMetadata[];
  queries?: FilterQueries;
  onChange: (event: SimpleFilterChangeEvent) => void;
  onClear: (event: SimpleFilterClearEvent) => void;
}> = (props) => {
  const onChange = (event: SimpleFilterChangeEvent) => {
    props.onChange({
      query: { ...event.query, selector: ["s", props.sample.data.index, ...(event.query.selector as SelectorPart[])] },
    });
  };

  const onClear = (event: SimpleFilterClearEvent) => {
    props.onClear({
      selector: ["s", props.sample.data.index, ...(event.selector as SelectorPart[])],
    });
  };

  return (
    <>
      <p class="has-text-weight-semibold">{props.sample.data.person.individualId}</p>
      <div class="field">
        <For each={props.fields}>
          {(field) => (
            <Filter
              field={field}
              query={props.queries ? props.queries[sampleFieldKey(props.sample, field)] : undefined}
              onChange={onChange}
              onClear={onClear}
            />
          )}
        </For>
      </div>
    </>
  );
};
