import { Component } from "solid-js";

export const Pos: Component<{ value: number }> = (props) => {
  return <span>{props.value}</span>;
};
