import { Component, For } from "solid-js";
import { Genotype } from "../../../api/vcf/SampleDataParser";
import { Allele } from "../Allele";

export const GenotypeField: Component<{ genotype: Genotype; refAllele: string; altAlleles: (string | null)[] }> = (
  props
) => {
  return (
    <For each={props.genotype.a}>
      {(alleleIndex, i) => (
        <>
          {i() !== 0 && <span class="phase">{props.genotype.p ? "|" : "/"}</span>}
          <Allele
            value={
              alleleIndex !== null ? (alleleIndex === 0 ? props.refAllele : props.altAlleles[alleleIndex - 1]) : null
            }
          />
        </>
      )}
    </For>
  );
};
