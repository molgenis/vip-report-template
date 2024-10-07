import { Component, For, Show } from "solid-js";
import { Genotype } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { ConfigFieldCustomGenotype } from "../../../../types/configField";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Allele } from "../../Allele";

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

export const FieldCustomGenotypeField: Component<{
  fieldConfig: ConfigFieldCustomGenotype;
  record: Item<Record>;
}> = (props) => {
  const sample = () => props.record.data.s[props.fieldConfig.sample.item.data.index];
  const refAllele = () => props.record.data.r;
  const altAlleles = () => props.record.data.a;
  const genotype = () => sample()["GT"] as Genotype;
  const allelicImbalance = () => isAllelicImbalance(genotype(), sample()["VIAB"] as number | undefined | null);

  return (
    <>
      <For each={genotype().a}>
        {(alleleIndex, i) => (
          <>
            {i() !== 0 && <span class="phase">{genotype().p ? "|" : "/"}</span>}
            <Allele
              value={alleleIndex !== null ? (alleleIndex === 0 ? refAllele() : altAlleles()[alleleIndex - 1]) : null}
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
