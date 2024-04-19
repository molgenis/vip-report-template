import { Component, Show } from "solid-js";
import { FieldProps } from "../field/Field";
import { Value, ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { useStore } from "../../../store";
import { FieldMultipleValue } from "../field/FieldMultipleValue";

export const GTEx: Component<FieldProps> = (props) => {
  const tissues: ValueString[] = props.info.value as ValueString[];
  const tissueStrings: string[] = tissues.map((value) => {
    return value != null ? value.toString() : "";
  });
  const [state] = useStore();

  return (
    <>
      <Show when={!props.context.hideDetails}>
        <FieldMultipleValue info={props.info.value as Value[]} infoMetadata={props.infoMeta} />
      </Show>
      <Show
        when={
          state.tissues !== undefined &&
          state.tissues.length > 0 &&
          tissues !== undefined &&
          tissues.length > 0 &&
          state.tissues.every((i) => i !== null && tissueStrings.includes(i))
        }
        keyed
      >
        <abbr title="Transcript associated with selected tissues." class="ml-1 is-clickable">
          <i class="fas fa-circle-exclamation has-text-success" />
        </abbr>
      </Show>
    </>
  );
};
