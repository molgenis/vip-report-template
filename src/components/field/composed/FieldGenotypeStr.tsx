import { Component, Show } from "solid-js";
import { Allele } from "../../Allele";
import { CellValueGenotype } from "../../../types/configCellComposed";
import { FieldGenotypeSnvSv } from "./FieldGenotypeSnvSv.tsx";

export const FieldGenotypeStr: Component<{
  value: CellValueGenotype;
}> = (props) => {
  const showGenotype = () => props.value.repeatUnitValue != null && props.value.repeatCount != null;

  return (
    <Show when={showGenotype()} fallback={<FieldGenotypeSnvSv value={props.value} />}>
      <Show when={props.value.displayRepeatUnit != null} fallback={<AlleleStr value={props.value.repeatUnitValue!} />}>
        <abbr title={`display repeat unit familiar to clinician: ${props.value.displayRepeatUnit!}`}>
          <AlleleStr value={props.value.repeatUnitValue!} />
        </abbr>
      </Show>
      <span class="ml-1">{`(n=${props.value.genotype.a
        .filter((allele) => allele !== null)
        .map((allele) => props.value.repeatCount![allele! - 1])
        .join("/")})`}</span>
      <Show when={props.value.repeatUnitMatch === false}>
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

const AlleleStr: Component<{
  value: string;
}> = (props) => {
  return (
    <>
      <Allele value={props.value} isAbbreviate={false} />
      <sub>n</sub>
    </>
  );
};
