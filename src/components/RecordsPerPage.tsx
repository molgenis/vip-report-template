import { Component, For } from "solid-js";
import { ConfigRecordsPerPage } from "../types/config";

export type RecordsPerPageChangeEvent = { number: number };
export type RecordsPerPageChangeCallback = (event: RecordsPerPageChangeEvent) => void;

export const RecordsPerPage: Component<{
  config: ConfigRecordsPerPage;
  onChange: (event: RecordsPerPageChangeEvent) => void;
}> = (props) => {
  const onRecordsPerPageChange = (event: Event) => {
    props.onChange({ number: Number((event.target as HTMLInputElement).value) });
  };

  console.log("beep");
  return (
    <div class="control">
      <span class="inline-control-text mr-2">Records per page</span>
      <div class="select">
        <select onChange={onRecordsPerPageChange}>
          <For each={props.config}>
            {(option) => (
              <option value={option.number} selected={option.selected}>
                {option.number}
              </option>
            )}
          </For>
        </select>
      </div>
    </div>
  );
};
