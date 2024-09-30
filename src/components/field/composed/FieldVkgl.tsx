import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { CellValueVkgl } from "../../../types/configCellComposed";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";

export const FieldVkgl: Component<{ value: CellValueVkgl }> = (props) => {
  const value = () => props.value.vkglCl;
  const title = () => {
    if (value() === null) return undefined;

    const labValues: Record<string, ValueString | undefined> = {
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
      .filter((_key, value) => value !== null && value !== undefined)
      .map((key, value) => `${key}:${value}`);

    return descriptions.length > 0 ? descriptions.join(", ") : null;
  };
  return (
    <Show when={value()} keyed>
      {(value) => (
        <Show when={title()} fallback={<span>{value}</span>} keyed>
          {(title) => <Abbr title={title} value={value} />}
        </Show>
      )}
    </Show>
  );
};
