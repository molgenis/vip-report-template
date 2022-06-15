import { Component, Show } from "solid-js";

export const FieldValueFlag: Component<{
  value: boolean | null | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <span>{props.value as boolean}</span>
    </Show>
  );
};
