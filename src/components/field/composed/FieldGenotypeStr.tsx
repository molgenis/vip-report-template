import { Component, Show } from "solid-js";
import { Allele } from "../../Allele";
import { CellValueGenotype } from "../../../types/configCellComposed";

export const FieldGenotypeStr: Component<{
  value: CellValueGenotype;
}> = (props) => {
  const showGenotype = () =>
    props.value.displayRepeatUnit !== undefined &&
    props.value.repeatUnitValue !== undefined &&
    props.value.repeatCount !== undefined &&
    props.value.repeatUnitMatch !== undefined;

  return (
    <Show when={showGenotype()}>
      <abbr title={`display repeat unit familiar to clinician: ${props.value.displayRepeatUnit!}`}>
        <Allele value={props.value.repeatUnitValue!} isAbbreviate={false} />
        <sub>n</sub>
      </abbr>
      <span class="ml-1">{`(n=${props.value.repeatCount!})`}</span>
      <Show when={!props.value.repeatUnitMatch!}>
        <abbr
          title={"the called repeat unit does not match the repeat unit in the loci bed file"}
          class="ml-1 is-clickable"
        >
          <i class="fas fa-circle-exclamation has-text-danger" />
        </abbr>
      </Show>
    </Show>
  );
};
