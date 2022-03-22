import { Component, For } from "solid-js";

export const Allele: Component<{ value: string | null }> = (props) => {
  // TODO abbreviate long alleles, config via props
  // TODO support breakends, symbolic alleles
  const bases = props.value ? [...props.value] : ["?"];
  return (
    <>
      <For each={bases}>
        {(base) => (
          <span
            classList={{
              base: true,
              "base-a": base === "A",
              "base-c": base === "C",
              "base-g": base === "G",
              "base-n": base === "N",
              "base-t": base === "T",
            }}
          >
            {base}
          </span>
        )}
      </For>
    </>
  );
};
