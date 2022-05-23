import { Component, createSignal, Show } from "solid-js";
import { Abbr } from "./Abbr";

export type CheckboxEvent = {
  value: string;
  checked: boolean;
};

export const Checkbox: Component<{
  value: string | undefined;
  label: string;
  desc?: string;
  onChange: (event: CheckboxEvent) => void;
}> = (props) => {
  const [checked, setChecked] = createSignal(false);

  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setChecked(target.checked);
    props.onChange({
      value: target.value,
      checked: target.checked,
    });
  };

  return (
    <label class="checkbox">
      <input class="mr-1" type="checkbox" value={props.value} checked={checked()} onChange={onChange} />
      <Show when={props.desc !== undefined} fallback={<span>{props.label}</span>}>
        <Abbr title={props.desc as string} value={props.label}></Abbr>
      </Show>
    </label>
  );
};
