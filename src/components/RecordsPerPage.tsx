import { Component, For } from "solid-js";
export type RecordsPerPageEvent = { number: number };

export const RecordsPerPage: Component<{
  initialValue: number;
  onChange: (event: RecordsPerPageEvent) => void;
}> = (props) => {
  const options = [10, 20, 50, 100];
  const onRecordsPerPageChange = (event: Event) => {
    props.onChange({ number: Number((event.target as HTMLInputElement).value) });
  };

  return (
    <div class="control">
      <span class="inline-control-text mr-2">Records per page</span>
      <div class="select">
        <select onChange={onRecordsPerPageChange}>
          <For each={options}>
            {(option) => (
              <option value={option} selected={option == props.initialValue}>
                {option}
              </option>
            )}
          </For>
        </select>
      </div>
    </div>
  );
};
