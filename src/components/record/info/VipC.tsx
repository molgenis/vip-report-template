import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { FieldProps } from "../field/Field";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getCsqInfo, getCsqInfoIndex } from "../../../utils/csqUtils";

export const VipC: Component<FieldProps> = (props) => {
  const value = () => props.info.value as ValueString;
  const description = () => {
    const fieldIndex = getCsqInfoIndex(props.infoMeta, "VIPP");
    return fieldIndex !== -1 ? (getCsqInfo(props.info, fieldIndex) as ValueString[]) : null;
  };

  return (
    <Show when={value()} keyed>
      {(value) => (
        <Show when={description()} fallback={value} keyed>
          {(description) => <Abbr title={description.join(", ")} value={value} />}
        </Show>
      )}
    </Show>
  );
};
