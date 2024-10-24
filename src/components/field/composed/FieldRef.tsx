import { Component } from "solid-js";
import { Allele } from "../../Allele";
import { CellValueRef } from "../../../types/configCellComposed";

export const FieldRef: Component<{ value: CellValueRef }> = (props) => {
  return <Allele value={props.value.ref} isAbbreviate={true} />;
};
