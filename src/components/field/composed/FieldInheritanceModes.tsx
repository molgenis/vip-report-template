import { Component, Show } from "solid-js";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldTypedMultiple } from "../typed/FieldTypedMultiple";
import { CellValueInheritanceModes } from "../../../types/configCellComposed";

export const FieldInheritanceModes: Component<{ value: CellValueInheritanceModes }> = (props) => {
  const inheritanceModesGene = (): ValueString[] => props.value.inheritanceModesGene;
  const isArInheritance = () => {
    let isArInheritance = false;
    if (
      (inheritanceModesGene() !== undefined && inheritanceModesGene().length === 0) ||
      inheritanceModesGene().includes("AR")
    ) {
      isArInheritance = props.value.isPossibleCompound !== undefined && props.value.isPossibleCompound;
    }
    return isArInheritance;
  };

  return (
    <>
      <FieldTypedMultiple info={inheritanceModesGene()} infoMetadata={props.value.fieldInheritanceModesGene} />
      <Show when={isArInheritance()} keyed>
        <abbr title="Variant is possibly part of a compound." class="ml-1 is-clickable">
          <i class="fas fa-circle-exclamation has-text-info" />
        </abbr>
      </Show>
    </>
  );
};
