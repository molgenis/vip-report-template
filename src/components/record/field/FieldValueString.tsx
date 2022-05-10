import { Component, Show } from "solid-js";

export const FieldValueString: Component<{
  value: string | null | undefined;
}> = (props) => {
  return (
    <Show when={props.value !== null && props.value !== undefined}>
      <Show when={(props.value as string).length > 20} fallback={<span>{props.value as string}</span>}>
        <abbr title={props.value as string}>{(props.value as string).substring(0, 20)}</abbr>
      </Show>
    </Show>
  );
};
