import { Component, Show } from "solid-js";
import { FieldTypedMultiple } from "../typed/FieldTypedMultiple";
import { CellValueInheritanceModes } from "../../../types/configCellComposed";
import { ValueCategorical } from "../../../utils/vcf.ts";

export const FieldInheritanceModes: Component<{ value: CellValueInheritanceModes }> = (props) => {
  const inheritanceModesGene = (): ValueCategorical[] => props.value.inheritanceModesGene;
  const isArInheritance = () => {
    let isArInheritance = false;
    if (
      (inheritanceModesGene() !== undefined && inheritanceModesGene().length === 0) ||
      inheritanceModesGene().findIndex((category) => category?.value === "AR") !== -1
    ) {
      isArInheritance =
        props.value.isPossibleCompound !== undefined &&
        props.value.isPossibleCompound !== null &&
        props.value.isPossibleCompound;
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
