import { Component, For, Show } from "solid-js";
import { Genotype } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { Allele } from "../Allele";

function isAllelicImbalance(genotype: Genotype, allelicDepth: number[] | undefined) {
  if (genotype.t === "het" && allelicDepth !== undefined) {
    let total = 0;
    allelicDepth?.forEach((value) => {
      total = total + value;
    });
    const balance = allelicDepth[0] / total;
    return balance < 0.2 || balance > 0.8;
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
  allelicDepth: number[] | undefined;
  readDepth: number | undefined;
}> = (props) => {
  const allelicImbalance: boolean = isAllelicImbalance(props.genotype, props.allelicDepth);
  const lowReadDepth = props.readDepth !== undefined && props.readDepth < 20;
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
        <abbr title={getTitle(lowReadDepth, allelicImbalance)} class="ml-1">
          <i class="fas fa-circle-exclamation has-text-danger" />
        </abbr>
      </Show>
    </>
  );
};
