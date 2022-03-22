import { Component, For } from "solid-js";
import { Allele } from "./Allele";

export const Alt: Component<{ value: (string | null)[] }> = (props) => {
  return (
    <>
      <For each={props.value}>
        {(alt, i) => (
          <>
            {i() !== 0 && <span>, </span>}
            <Allele value={alt} />
          </>
        )}
      </For>
    </>
  );
};
