import { Component } from "solid-js";

export const Chrom: Component<{ value: string }> = (props) => {
  return <span>{props.value}</span>;
};
