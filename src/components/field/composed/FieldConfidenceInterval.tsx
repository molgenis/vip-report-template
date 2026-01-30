import { Component } from "solid-js";
import { CellValueConfidenceInterval } from "../../../types/configCellComposed";

export const FieldConfidenceInterval: Component<{
  value: CellValueConfidenceInterval;
}> = (props) => {
  return (
    <span>
      {props.value.genotype.a
        .map((allele) => (allele !== null ? props.value.confidenceInterval[allele - 1] : "?"))
        .join("/")}
    </span>
  );
};
