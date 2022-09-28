import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { FieldProps } from "../field/Field";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getCsqInfo, getCsqInfoIndex } from "../../../utils/csqUtils";

export const Vkgl: Component<FieldProps> = (props) => {
  const value = () => props.info.value as ValueString;
  const title = () => {
    if (value() === null) return undefined;

    const labs: { [key: string]: string } = {
      VKGL_AMC: "AMC",
      VKGL_ERASMUS: "Erasmus",
      VKGL_LUMC: "LUMC",
      VKGL_NKI: "NKI",
      VKGL_RADBOUD_MUMC: "Radboud/MUMC",
      VKGL_UMCG: "UMCG",
      VKGL_UMCU: "UMCU",
      VKGL_VUMC: "VUMC",
    };

    const descriptions = [];
    for (const key in labs) {
      const fieldIndex = getCsqInfoIndex(props.infoMeta, key);
      if (fieldIndex !== -1) {
        const value = getCsqInfo(props.info, fieldIndex) as ValueString;
        if (value !== null) descriptions.push(`${labs[key]}:${value}`);
      }
    }
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
