import { Component, For } from "solid-js";
import { FieldMetadataContainer } from "../api/vcf/VcfParser";
import { flattenFieldMetadata, getFullId, isNumerical } from "../utils/field";
import { FieldMetadata } from "../api/vcf/MetadataParser";

export type SortEvent = {
  fieldMetadata: FieldMetadata | null;
  ascending: boolean;
};

export const Sort: Component<{
  fieldMetadataContainer: FieldMetadataContainer;
  onChange: (event: SortEvent) => void;
}> = (props) => {
  const fieldOptions = flattenFieldMetadata(props.fieldMetadataContainer)
    .filter((fieldMetadata) => isNumerical(fieldMetadata) && fieldMetadata.number.count === 1)
    .flatMap((fieldMetadata) => [
      { fieldMetadata: fieldMetadata, ascending: true },
      {
        fieldMetadata: fieldMetadata,
        ascending: false,
      },
    ]);

  const onChange = (event: Event) => {
    const index = Number((event.target as HTMLInputElement).value);
    if (index >= 0) props.onChange(fieldOptions[index]);
    else props.onChange({ fieldMetadata: null, ascending: index === -2 });
  };

  return (
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Sort by:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="select">
            <select onChange={onChange}>
              <option value="-2">POS (ascending)</option>
              <option value="-1">POS (descending)</option>
              <For each={fieldOptions}>
                {(fieldOption, i) => (
                  <option value={i()}>
                    {getFullId(fieldOption.fieldMetadata)} {fieldOption.ascending ? "(ascending)" : "(descending)"}
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