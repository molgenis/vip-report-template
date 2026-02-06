import { Component } from "solid-js";
import { CellValueSpanningReads } from "../../../types/configCellComposed";

export const FieldSpanningReads: Component<{
  value: CellValueSpanningReads;
}> = (props) => {
  const value = () => {
    if (props.value.genotype.t === "hom_a" || props.value.genotype.t === "hom_r") {
      return props.value.spanningReads[0];
    } else {
      return props.value.genotype.a
        .map((allele) => (allele !== null ? props.value.spanningReads[allele - 1] : "?"))
        .join("/");
    }
  };

  return <span>{value()}</span>;
};
