import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Sample } from "@molgenis/vip-report-api/src/Api";
import { Filter, FilterChangeEvent, FilterClearEvent } from "./Filter";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";

export const SampleFilters: Component<{
  sample: Sample;
  fields: FieldMetadata[];
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  defaultValues: { [key: string]: Value };
}> = (props) => {
  const onChange = (event: FilterChangeEvent) => {
    props.onChange({
      query: { ...event.query, selector: ["s", props.sample.index.toString(), ...event.query.selector] },
    });
  };

  const onClear = (event: FilterClearEvent) => {
    props.onClear({
      selector: ["s", props.sample.index.toString(), ...event.selector],
    });
  };

  return (
    <>
      <p class="has-text-weight-semibold">{props.sample.person.individualId}</p>
      <div class="field">
        <For each={props.fields}>
          {(field) => (
            <Filter field={field} onChange={onChange} onClear={onClear} defaultValue={props.defaultValues[field.id]} />
          )}
        </For>
      </div>
    </>
  );
};
