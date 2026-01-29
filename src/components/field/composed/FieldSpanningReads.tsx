import { Component } from "solid-js";
import { CellValueSpanningReads } from "../../../types/configCellComposed";

export const FieldSpanningReads: Component<{
  value: CellValueSpanningReads;
}> = (props) => {
  console.log(props.value);
  return (
    <span>
      {props.value.genotype.a
        .filter((allele) => allele !== null)
        .map((allele) => props.value.spanningReads![allele! - 1])
        .join("/")}
    </span>
  );
};
