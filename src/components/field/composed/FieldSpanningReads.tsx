import { Component } from "solid-js";
import { CellValueSpanningReads } from "../../../types/configCellComposed";

export const FieldSpanningReads: Component<{
  value: CellValueSpanningReads;
}> = (props) => {
  return (
    <span>
      {props.value.genotype.a
        .map((allele) => (allele !== null ? props.value.spanningReads![allele - 1] : "?"))
        .join("/")}
    </span>
  );
};
