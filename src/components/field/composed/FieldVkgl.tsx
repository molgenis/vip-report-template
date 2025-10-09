import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { CellValueVkgl } from "../../../types/configCellComposed";
import { ValueCategorical } from "../../../utils/vcf.ts";

export const FieldVkgl: Component<{ value: CellValueVkgl }> = (props) => {
  const label = (): string | null => props.value.vkglCl?.label || null;
  const title = () => {
    if (label() === null) return undefined;

    const labValues: Record<string, ValueCategorical | undefined> = {
      AMC: props.value.vkglAmc,
      Erasmus: props.value.vkglErasmus,
      LUMC: props.value.vkglLumc,
      NKI: props.value.vkglNki,
      "Radboud/MUMC": props.value.vkglRadboudMumc,
      UMCG: props.value.vkglUmcg,
      UMCU: props.value.vkglUmcu,
      VUMC: props.value.vkglVumc,
    };

    const descriptions = Object.entries(labValues)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${key}:${value?.label}`);

    return descriptions.length > 0 ? descriptions.join(", ") : null;
  };
  return (
    <Show when={label()} keyed>
      {(value) => (
        <Show when={title()} fallback={<span>{value}</span>} keyed>
          {(title) => <Abbr title={title} value={value} />}
        </Show>
      )}
    </Show>
  );
};
