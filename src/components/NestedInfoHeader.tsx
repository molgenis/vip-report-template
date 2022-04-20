import { Component, For } from "solid-js";

export const NestedInfoHeader: Component<{
  fields: string[];
}> = (props) => {
  return <For each={props.fields}>{(field) => <th>{field}</th>}</For>;
};
