import { Component, For } from "solid-js";
import { getVariantTypes, VariantType, VariantTypeId } from "../utils/variantTypeUtils";

export type VariantTypeChangeEvent = { id: VariantTypeId };
export type VariantTypeChangeCallback = (event: VariantTypeChangeEvent) => void;

export const VariantTypeSelect: Component<{
  value: VariantType | null;
  variantTypeIds: Set<VariantTypeId>;
  onChange: VariantTypeChangeCallback;
}> = (props) => {
  const onChange = (variantTypeId: VariantTypeId) => {
    return props.onChange({ id: variantTypeId });
  };

  return (
    <>
      <p class="has-text-weight-semibold">Variant types</p>
      <div class="field">
        <ul>
          <For each={getVariantTypes(props.variantTypeIds)}>
            {(variantType: VariantType) => (
              <li>
                <a onClick={() => onChange(variantType.id)}>
                  <abbr title={variantType.description}>{variantType.label}</abbr>
                </a>
              </li>
            )}
          </For>
        </ul>
      </div>
    </>
  );
};
