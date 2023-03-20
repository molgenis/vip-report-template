import { Component, For, Show } from "solid-js";
import { Genotype } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { Allele } from "../Allele";

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

function getTitle(lowReadDepth: boolean, allelicImbalance: boolean) {
  let title = "";
  if (lowReadDepth) {
    title = "Read depth < 20";
  }
  if (allelicImbalance) {
    if (lowReadDepth) {
      title = `${title}, `;
    }
    title = `${title}Allelic imbalance`;
  }
  return title;
}

export const GenotypeField: Component<{
  genotype: Genotype;
  refAllele: string;
  altAlleles: (string | null)[];
  isAbbreviate: boolean;
  allelicBalance: number | undefined | null;
  readDepth: number | undefined | null;
}> = (props) => {
  const allelicImbalance: boolean = isAllelicImbalance(props.genotype, props.allelicBalance);
  const lowReadDepth = props.readDepth !== undefined && props.readDepth !== null && props.readDepth < 20;
  return (
    <>
      <For each={props.genotype.a}>
        {(alleleIndex, i) => (
          <>
            {i() !== 0 && <span class="phase">{props.genotype.p ? "|" : "/"}</span>}
            <Allele
              value={
                alleleIndex !== null ? (alleleIndex === 0 ? props.refAllele : props.altAlleles[alleleIndex - 1]) : null
              }
              isAbbreviate={props.isAbbreviate}
            />
          </>
        )}
      </For>
      <Show when={lowReadDepth || allelicImbalance}>
        <abbr title={getTitle(lowReadDepth, allelicImbalance)} class="ml-1 is-clickable">
          <i class="fas fa-circle-exclamation has-text-danger" />
        </abbr>
      </Show>
    </>
  );
};
