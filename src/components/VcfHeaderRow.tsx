import { Component, Show } from "solid-js";

export const VcfHeaderRow: Component<{
  value: string | null;
  title: string;
}> = (props) => {
  return (
    <Show when={props.value !== null}>
      <tr>
        <th>{props.title}:</th>
        <td>{props.value}</td>
      </tr>
    </Show>
  );
};
