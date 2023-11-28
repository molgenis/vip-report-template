import { Component, For, Show } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { Filter } from "./Filter";
import { FilterQueries } from "../../store";
import { sampleCustomKey, sampleFieldKey } from "../../utils/query";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";
import { FilterInheritance } from "./FilterInheritance";
import { FilterVI } from "./FilterVI";

export const SampleFilters: Component<{
  sample: Item<Sample>;
  fields: FieldMetadata[];
  queries?: FilterQueries;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  if (props.sample == undefined) {
    throw Error("Cannot create Sample filters without a sample.");
  }

  const qualityFields = props.fields.filter((field) => field.id !== "VIM" && field.id !== "VID" && field.id !== "VI");
  let vimField: FieldMetadata | undefined;
  let vidField: FieldMetadata | undefined;
  let viField: FieldMetadata | undefined;
  props.fields.forEach((field) => {
    if (field.id === "VIM") {
      vimField = field;
    } else if (field.id === "VID") {
      vidField = field;
    } else if (field.id === "VI") {
      viField = field;
    }
  });

  const inheritanceFilterKey: string = sampleCustomKey(props.sample, "VIP_Inheritance");
  return (
    <>
      <Show when={vimField !== undefined && vidField !== undefined}>
        <abbr class="has-text-weight-semibold" title="Inheritance Match">
          {props.sample.data.person.individualId} Inh. Match
        </abbr>
        <div class="field">
          {" "}
          <FilterInheritance
            vimField={vimField as FieldMetadata}
            vidField={vidField as FieldMetadata}
            query={props.queries ? props.queries[inheritanceFilterKey] : undefined}
            onChange={props.onChange}
            onClear={props.onClear}
            sample={props.sample}
            key={inheritanceFilterKey}
          />
        </div>
      </Show>
      <Show when={viField !== undefined}>
        <abbr
          class="has-text-weight-semibold"
          title="Inheritance Modes that are suitable for the pedigree genotypes and affected statuses"
        >
          {props.sample.data.person.individualId} Inh. Modes
        </abbr>
        <div class="field">
          {" "}
          <FilterVI
            field={viField as FieldMetadata}
            query={props.queries ? props.queries[sampleFieldKey(props.sample, viField as FieldMetadata)] : undefined}
            onChange={props.onChange}
            onClear={props.onClear}
            sample={props.sample}
          />
        </div>
      </Show>
      <p class="has-text-weight-semibold">{props.sample.data.person.individualId}: Quality</p>
      <div class="field">
        <For each={qualityFields}>
          {(field) => (
            <>
              {" "}
              <Filter
                field={field}
                query={props.queries ? props.queries[sampleFieldKey(props.sample, field)] : undefined}
                onChange={props.onChange}
                onClear={props.onClear}
                sample={props.sample}
              />
            </>
          )}
        </For>
      </div>
    </>
  );
};
