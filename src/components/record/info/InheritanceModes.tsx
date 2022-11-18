import { Component, Show } from "solid-js";
import { Value, ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldProps } from "../field/Field";
import { FieldMultipleValue } from "../field/FieldMultipleValue";

export const InheritanceModes: Component<FieldProps> = (props) => {
  const inheritanceModesGene: string | null = props.info.value as ValueString;
  let isArInheritance = false;
  if (inheritanceModesGene === null || inheritanceModesGene.includes("AR")) {
    isArInheritance = props.context.isPossibleCompound !== undefined && props.context.isPossibleCompound;
  }
  return (
    <>
      <FieldMultipleValue info={props.info.value as Value[]} infoMetadata={props.infoMeta} />
      <Show when={isArInheritance} keyed>
        &nbsp
        <abbr title="Variant is possibly part of a compound.">
          <i class="fas fa-circle-exclamation has-text-info" />
        </abbr>
      </Show>
    </>
  );
};
