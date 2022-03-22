import { Component } from "solid-js";
import { Allele } from "./Allele";

export const Ref: Component<{ value: string }> = (props) => {
  return <Allele value={props.value} />;
};
