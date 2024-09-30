import { Component, Show } from "solid-js";
import { Abbr } from "../Abbr";

export type CheckboxEvent = {
  value: string;
  checked: boolean;
};

// TODO remove
export const CheckboxDeprecated: Component<{
  value?: string;
  label: string;
  desc?: string | null;
  checked?: boolean;
  onChange: (event: CheckboxEvent) => void;
}> = (props) => {
  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    props.onChange({
      value: target.value,
      checked: target.checked,
    });
  };

  return (
    <label class="checkbox">
      <input class="mr-1" type="checkbox" value={props.value} checked={props.checked} onChange={onChange} />
      <Show when={props.desc} fallback={<span>{props.label}</span>}>
        {(desc) => <Abbr title={desc()} value={props.label} />}
      </Show>
    </label>
  );
};
