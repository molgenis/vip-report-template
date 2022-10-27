import { Component, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { Filter } from "./Filter";
import { FilterQueries } from "../../store";
import { sampleFieldKey } from "../../utils/query";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";

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

  return (
    <>
      <p class="has-text-weight-semibold">{props.sample.data.person.individualId}</p>
      <div class="field">
        <For each={props.fields}>
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
