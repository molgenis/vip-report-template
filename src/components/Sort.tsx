import { Component, createMemo, For } from "solid-js";
import { isNumerical } from "../utils/field";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export type SortEvent = {
  field: FieldMetadata;
  ascending: boolean;
};

export const Sort: Component<{
  fields: FieldMetadata[];
  onChange: (event: SortEvent) => void;
  onClear: () => void;
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
    index === -1 ? props.onClear() : props.onChange(sortOptions()[index]);
  };

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
                  <option value={i()}>
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
