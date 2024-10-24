import { Component, For, Show } from "solid-js";
import { Genotype } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { Allele } from "../../Allele";
import { CellValueGenotype } from "../../../types/configCellComposed";

function isAllelicImbalance(genotype: Genotype, allelicBalance: number | undefined | null) {
  if (genotype.t === "het" && allelicBalance !== undefined && allelicBalance !== null) {
    return allelicBalance < 0.2 || allelicBalance > 0.8;
  } else if (
    (genotype.t === "hom_a" || genotype.t === "hom_r") &&
    allelicBalance !== undefined &&
    allelicBalance !== null
  ) {
    return allelicBalance > 0.02 && allelicBalance < 0.98;
  }
  return false;
}

function getTitle(allelicImbalance: boolean) {
  return allelicImbalance ? `Allelic imbalance` : ``;
}

export const FieldGenotypeSnvSv: Component<{
  value: CellValueGenotype;
}> = (props) => {
  const refAllele = () => props.value.refAllele;
  const altAlleles = () => props.value.altAlleles;
  const genotype = () => props.value.genotype;
  const allelicImbalance = () => isAllelicImbalance(genotype(), props.value.viab);

  return (
    <>
      <For each={genotype().a}>
        {(alleleIndex, i) => (
          <>
            {i() !== 0 && <span class="phase">{genotype().p ? "|" : "/"}</span>}
            <Allele
              value={
                alleleIndex !== null
                  ? alleleIndex === 0
                    ? refAllele()
                    : (altAlleles()[alleleIndex - 1] as string | null)
                  : null
              }
              isAbbreviate={true}
            />
          </>
        )}
      </For>
      <Show when={allelicImbalance()}>
        <abbr title={getTitle(allelicImbalance())} class="ml-1 is-clickable">
          <i class="fas fa-circle-exclamation has-text-danger" />
        </abbr>
      </Show>
    </>
  );
};
