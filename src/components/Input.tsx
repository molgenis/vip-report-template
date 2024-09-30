import { Component } from "solid-js";

export type InputValue = string;
export type InputChangeEvent = { value: InputValue };
export type InputChangeCallback = (event: InputChangeEvent) => void;
export type InputProps = { placeholder?: string; value?: InputValue; onValueChange: InputChangeCallback };

export const Input: Component<InputProps> = (props) => {
  const onChange = (value: InputValue) => props.onValueChange({ value });
  const onInput = (event: Event) => onChange((event.target as HTMLInputElement).value);

  return (
    <div class="field">
      <div class="control is-expanded">
        {/* do not use 'value=' because 'value=undefined' will display the value 'undefined' in the input */}
        <input
          class="input is-small"
          type="text"
          {...(props.value ? { value: props.value } : {})}
          placeholder={props.placeholder}
          onInput={onInput}
        />
      </div>
    </div>
  );
};
