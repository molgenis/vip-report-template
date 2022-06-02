import { Component, createMemo, For, onMount } from "solid-js";
import { isNumerical } from "../utils/field";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { getPath } from "../utils/ApiUtils";
import { SortPath } from "@molgenis/vip-report-api/src/Api";

export type SortEvent = {
  field: (string | number)[];
  ascending: boolean;
};

export const Sort: Component<{
  fields: FieldMetadata[];
  onChange: (event: SortEvent) => void;
  onClear: () => void;
  defaultSort?: { field: SortPath; compare: "asc" | "desc" };
}> = (props) => {
  const sortableFields = () => props.fields.filter((field) => isNumerical(field) && field.number.count === 1);

  const sortOptions = createMemo(() =>
    sortableFields().flatMap((field) => [
      { field, ascending: true },
      { field, ascending: false },
    ])
  );

  const onSortChange = (event: Event) => {
    const index = Number((event.target as HTMLInputElement).value);
    index === -1
      ? props.onClear()
      : props.onChange({
          field: getPath(sortOptions()[index].field),
          ascending: sortOptions()[index].ascending,
        });
  };

  onMount(() => {
    if (props.defaultSort !== undefined) {
      let defaultSortOption = undefined;
      sortOptions().forEach((option) => {
        if (
          props.defaultSort !== undefined &&
          (props.defaultSort.compare === "asc") === option.ascending &&
          getPath(option.field) === props.defaultSort.field
        ) {
          defaultSortOption = option;
          return;
        }
      });
      if (defaultSortOption !== undefined) {
        props.onChange(defaultSortOption);
      }
    }
  });

  return (
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Sort by:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="select">
            <select onChange={onSortChange}>
              <option value="-1"></option>
              <For each={sortOptions()}>
                {(fieldOption, i) => (
                  <option
                    value={i()}
                    selected={
                      props.defaultSort !== undefined &&
                      (props.defaultSort.compare === "asc") === fieldOption.ascending &&
                      getPath(fieldOption.field) === props.defaultSort.field
                    }
                  >
                    {fieldOption.field.label || fieldOption.field.id}{" "}
                    {fieldOption.ascending ? "(ascending)" : "(descending)"}
                  </option>
                )}
              </For>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
