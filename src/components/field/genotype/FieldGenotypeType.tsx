import { Component } from "solid-js";
import { Genotype } from "@molgenis/vip-report-vcf";

export const FieldGenotypeType: Component<{
  value: Genotype;
}> = (props) => {
  const displayValue = () => props.value.a.join(props.value.p ? "|" : "/");
  return <span>{displayValue()}</span>;
};
