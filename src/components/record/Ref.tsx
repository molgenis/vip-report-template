import { Component } from "solid-js";
import { Allele } from "./Allele";

export const Ref: Component<{ value: string; isAbbreviate: boolean }> = (props) => {
  return <Allele value={props.value} isAbbreviate={props.isAbbreviate} />;
};
