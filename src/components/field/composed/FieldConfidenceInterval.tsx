import { Component } from "solid-js";
import { CellValueConfidenceInterval } from "../../../types/configCellComposed";

export const FieldConfidenceInterval: Component<{
  value: CellValueConfidenceInterval;
}> = (props) => {
  return (
    <span>
      {props.value.genotype.a
        .filter((allele) => allele !== null)
        .map((allele) => props.value.confidenceInterval![allele! - 1])
        .join("/")}
    </span>
  );
};
