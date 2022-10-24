import { Component, For, Show } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Item, QueryClause, Sample, SelectorPart } from "@molgenis/vip-report-api/src/Api";
import { Filter } from "./Filter";
import { FilterQueries } from "../../store";
import { sampleFieldKey, selectorKey } from "../../utils/query";
import { FilterAllelicBalance } from "./FilterAllelicBalance";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";

export const SampleFilters: Component<{
  sample: Item<Sample>;
  fields: FieldMetadata[];
  queries?: FilterQueries;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
}> = (props) => {
  const onChange = (event: FilterChangeEvent) => {
    props.onChange({
      key: selectorKey(["s", props.sample.data.index, event.key]),
      query: {
        ...event.query,
        selector: ["s", props.sample.data.index, ...((event.query as QueryClause).selector as SelectorPart[])],
      } as QueryClause,
    });
  };

  const onClear = (event: FilterClearEvent) => {
    props.onClear({
      key: selectorKey(["s", props.sample.data.index, event.key]),
    });
  };

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
                onChange={onChange}
                onClear={onClear}
              />
              <Show when={field.id === "AD"} keyed>
                <FilterAllelicBalance
                  sample={props.sample}
                  onChange={props.onChange}
                  onClear={props.onClear}
                  queries={props.queries}
                />
              </Show>
            </>
          )}
        </For>
      </div>
    </>
  );
};
