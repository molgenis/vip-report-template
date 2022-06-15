import { Component } from "solid-js";

export const Qual: Component<{ value: number | null }> = (props) => {
  return <>{props.value && <span>{props.value}</span>}</>;
};
