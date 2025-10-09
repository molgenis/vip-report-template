import { Component, createEffect, createSignal } from "solid-js";
import { removeZeroWidthAndTrim } from "../utils/utils.ts";

export const SearchBox: Component<{ value?: string | null; onInput: (value: string) => void }> = (props) => {
  const [value, setValue] = createSignal("");

  createEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  });

  return (
    <div class="field has-addons">
      <div class="control has-icons-right is-expanded">
        <input
          class="input"
          type="text"
          value={value()}
          onInput={(e) => setValue(removeZeroWidthAndTrim((e.target as HTMLInputElement).value))}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              props.onInput(value());
            } else if (e.code === "Escape") {
              setValue("");
              props.onInput("");
            }
          }}
        />
        {value().length > 0 && (
          <span
            class="icon is-clickable is-right"
            onClick={() => {
              setValue("");
              props.onInput("");
            }}
          >
            <i class="fas fa-circle-xmark" />
          </span>
        )}
      </div>
      <div class="control">
        <a class="button is-info" onClick={() => props.onInput(value())}>
          <span class="icon is-left">
            <i class="fas fa-search" />
          </span>
        </a>
      </div>
    </div>
  );
};
