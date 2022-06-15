import { Component, Show } from "solid-js";

export const FieldValueCharacter: Component<{
  value: string | null | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <span>{props.value as string}</span>
    </Show>
  );
};
