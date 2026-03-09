import { Component, createEffect, createSignal, For, onMount } from "solid-js";
import { CellValueLocus } from "../../types/configCellComposed";


export const Classification: Component<{ locus: CellValueLocus }> = (props) => {
  const [value, setValue] = createSignal("-");

  const OPTIONS = ["-", "B", "LB", "VUS", "LP", "P", "X"] as const;
  type Option = (typeof OPTIONS)[number];

    let timeout: ReturnType<typeof setTimeout> | null = null;

    onMount(() => {
      console.log("MOUNT!");
      const stored = localStorage.getItem(props.locus.c + props.locus.p);
      if (stored != null && OPTIONS.includes(stored as Option)) {
        setValue(stored as Option);
      }
    });

    const debouncedSave = (newValue: string) => {
      console.log("SAVE!");
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log("SAVE 2!");
        localStorage.setItem(props.locus.c + props.locus.p, newValue);
      }, 500);
    };

  createEffect(() => {
    const newValue = value(); // tracks this signal
    debouncedSave(newValue); // pass current value
  });

    return (
      <select
        value={value()}
        onChange={e => setValue(e.currentTarget.value as Option)}
      >
        <For each={OPTIONS}>{opt => (
          <option value={opt}>{opt}</option>
        )}</For>
      </select>
    );
  }
