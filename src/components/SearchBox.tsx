import { Component, createSignal } from "solid-js";

export const SearchBox: Component<{ onInput: (value: string) => void }> = (props) => {
  const [value, setValue] = createSignal("");

  return (
    <div class="field has-addons">
      <p class="control has-icons-right is-expanded">
        <input
          class="input"
          type="text"
          value={value()}
          onInput={(e) => setValue((e.target as HTMLInputElement).value)}
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
      </p>
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
