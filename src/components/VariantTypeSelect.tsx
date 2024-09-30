import { Component, For } from "solid-js";
import { getVariantTypes, VariantType, VariantTypeId } from "../utils/variantTypeUtils";

export type VariantTypeChangeEvent = { id: VariantTypeId };
export type VariantTypeChangeCallback = (event: VariantTypeChangeEvent) => void;
export type VariantTypeSelectProps = { onChange: VariantTypeChangeCallback };

export const VariantTypeSelect: Component<VariantTypeSelectProps> = (props) => {
  const onChange = (variantTypeId: VariantTypeId) => {
    return props.onChange({ id: variantTypeId });
  };

  return (
    <>
      <p class="has-text-weight-semibold">Variant types</p>
      <div class="field">
        <ul>
          <For each={getVariantTypes()}>
            {(variantType: VariantType) => (
              <li>
                <abbr class="is-clickable" title={variantType.description} onClick={() => onChange(variantType.id)}>
                  {variantType.label}
                </abbr>
              </li>
            )}
          </For>
        </ul>
      </div>
    </>
  );
};
