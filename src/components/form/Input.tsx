import { Component } from "solid-js";
import { removeZeroWidthAndTrim } from "../../utils/utils.ts";

export type InputValue = string;
export type InputChangeEvent = { value: InputValue };
export type InputChangeCallback = (event: InputChangeEvent) => void;
export type InputProps = { placeholder?: string; value?: InputValue; onValueChange: InputChangeCallback };

export const Input: Component<InputProps> = (props) => {
  // do not use 'value={props.value}' because 'value=undefined' will display the value 'undefined' in the input
  return (
    <input
      class="input is-small"
      type="text"
      {...(props.value ? { value: props.value } : {})}
      placeholder={props.placeholder}
      onInput={(event) =>
        props.onValueChange({ value: removeZeroWidthAndTrim((event.target as HTMLInputElement).value) })
      }
    />
  );
};
