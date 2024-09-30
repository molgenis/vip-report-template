import "./Select.scss";
import { Component, For, Show } from "solid-js";

export type SelectOption = { id: string; label: string };
export type SelectValue = string;
export type SelectChangeEvent = { value: SelectValue };
export type SelectChangeCallback = (event: SelectChangeEvent) => void;
export type SelectProps = {
  placeholder?: string;
  options: SelectOption[];
  value?: SelectValue;
  onValueChange: SelectChangeCallback;
};

export const Select: Component<SelectProps> = (props) => {
  return (
    <div class="select is-small is-fullwidth">
      <select required onChange={(e) => props.onValueChange({ value: (e.target as HTMLSelectElement).value })}>
        <Show when={props.placeholder}>
          <option value="" selected={props.value === undefined}>
            {props.placeholder}
          </option>
        </Show>
        <For each={props.options}>
          {(option) => (
            <option value={option.id} selected={option.id === props.value}>
              {option.label}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};
